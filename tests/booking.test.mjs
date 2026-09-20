import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import { build } from "esbuild";

async function load(path) {
  const result = await build({ entryPoints: [new URL(path, import.meta.url).pathname], bundle: true, write: false, platform: "node", format: "esm", external: ["next/headers"] });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
}
const { candidateSlots, dateKey, overlaps, parseBooking } = await load("../lib/scheduling.ts");
const { handleBooking } = await load("../lib/booking-api.ts");
const { verifyBookingBrowser } = await load("../lib/booking-bot-protection.ts");
const now = new Date("2026-09-19T12:00:00Z");
const first = "2026-09-19T14:00:00.000Z";

function database() {
  const db = new DatabaseSync(":memory:");
  db.exec("CREATE TABLE call_bookings (request_id TEXT PRIMARY KEY, start TEXT NOT NULL UNIQUE, end TEXT NOT NULL, fingerprint TEXT NOT NULL, event_id TEXT NOT NULL, state TEXT NOT NULL, created_at INTEGER NOT NULL); CREATE TABLE booking_rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL)");
  return { db, prepare(sql) { let values = []; return {
    bind(...args) { values = args; return this; },
    async first() { return db.prepare(sql).get(...values) || null; },
    async all() { return { results: db.prepare(sql).all(...values) }; },
    async run() { return { meta: { changes: Number(db.prepare(sql).run(...values).changes) } }; },
  }; } };
}
function payload(overrides = {}) { return { requestId: crypto.randomUUID(), start: first, name: "Test Visitor", email: "visitor@example.com", notes: "Product conversation", timeZone: "America/New_York", website: "", ...overrides }; }
function request(body, headers = {}) { return new Request("https://portfolio.example/api/booking/reserve", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://portfolio.example", "CF-Connecting-IP": "192.0.2.10", ...headers }, body: JSON.stringify(body) }); }
function fixture(t, options = {}) {
  const DB = database(); t.after(() => DB.db.close());
  const env = { DB, GOOGLE_CLIENT_ID: "test-id", GOOGLE_CLIENT_SECRET: "test-secret", GOOGLE_REFRESH_TOKEN: "test-refresh", BOOKING_HASH_SECRET: "test-hash", BOOKING_ENABLED: "true" };
  const events = new Map(); let insertions = 0;
  t.mock.method(globalThis, "fetch", async (url, init) => {
    if (url === "https://oauth2.googleapis.com/token") return Response.json({ access_token: "fixture-token" });
    assert.ok(String(url).startsWith("https://www.googleapis.com/calendar/v3/"));
    if (String(url).endsWith("freeBusy")) return Response.json({ calendars: { primary: options.calendarError ? { errors: [{ reason: "internalError" }] } : { busy: options.busy || [] } } });
    if (init.method === "POST") {
      insertions++;
      const body = JSON.parse(init.body);
      assert.match(String(url), /conferenceDataVersion=1&sendUpdates=all/);
      assert.equal(body.conferenceData.createRequest.conferenceSolutionKey.type, "hangoutsMeet");
      assert.equal(body.end.dateTime, "2026-09-19T14:30:00.000Z");
      const event = { id: body.id, status: "confirmed", hangoutLink: "https://meet.google.com/test-preview-only" };
      events.set(body.id, event);
      if (options.timeout) throw new Error("simulated network timeout after Google accepted the event");
      return Response.json(event, { status: 200 });
    }
    return events.has(String(url).split("/").pop()) ? Response.json(events.get(String(url).split("/").pop())) : new Response(null, { status: 404 });
  });
  return { env, events, insertions: () => insertions };
}

test("seven Eastern calendar days include weekends, with eight 30-minute slots per day", () => {
  const slots = candidateSlots(now);
  assert.equal(slots.length, 56);
  assert.equal(slots[0].start, first);
  assert.equal(slots[7].end, "2026-09-19T18:00:00.000Z");
  assert.equal(dateKey(new Date(slots.at(-1).start)), "2026-09-25");
  assert.equal(candidateSlots(new Date("2026-09-19T14:10:00Z"))[0].start, "2026-09-19T14:30:00.000Z");
  assert.equal(candidateSlots(new Date("2026-09-19T22:00:00Z")).length, 48);
});
test("Eastern hours remain 10–14 through spring and autumn DST changes", () => {
  const spring = candidateSlots(new Date("2026-03-07T12:00:00Z"));
  assert.equal(spring[0].start, "2026-03-07T15:00:00.000Z");
  assert.equal(spring[8].start, "2026-03-08T14:00:00.000Z");
  const fall = candidateSlots(new Date("2026-10-31T12:00:00Z"));
  assert.equal(fall[0].start, "2026-10-31T14:00:00.000Z");
  assert.equal(fall[8].start, "2026-11-01T15:00:00.000Z");
});
test("busy intervals exclude overlaps but allow adjacent calls", () => {
  assert.ok(overlaps({ start: first, end: "2026-09-19T14:30:00Z" }, { start: "2026-09-19T14:20:00Z", end: "2026-09-19T14:40:00Z" }));
  assert.equal(overlaps({ start: first, end: "2026-09-19T14:30:00Z" }, { start: "2026-09-19T14:30:00Z", end: "2026-09-19T15:00:00Z" }), false);
  assert.equal(parseBooking(payload({ email: "bad-address" })), null);
  assert.equal(parseBooking(payload({ timeZone: "invented/timezone" })), null);
  assert.equal(parseBooking(payload({ website: "spam" })), null);
});
test("unconfigured scheduler fails closed", async () => {
  const res = await handleBooking(new Request("https://portfolio.example/api/booking/availability"), {}, now);
  assert.equal(res.status, 503); assert.equal((await res.json()).slots, undefined);
});
test("calendar failures never become available slots", async (t) => {
  const f = fixture(t, { calendarError: true });
  const res = await handleBooking(new Request("https://portfolio.example/api/booking/availability", { headers: { "CF-Connecting-IP": "192.0.2.10" } }), f.env, now);
  assert.equal(res.status, 503);
});
test("live availability excludes Calendar busy times", async (t) => {
  const f = fixture(t, { busy: [{ start: first, end: "2026-09-19T15:00:00.000Z" }] });
  const res = await handleBooking(new Request("https://portfolio.example/api/booking/availability", { headers: { "CF-Connecting-IP": "192.0.2.10" } }), f.env, now);
  const data = await res.json(); assert.equal(data.slots.length, 54); assert.equal(data.slots[0].start, "2026-09-19T15:00:00.000Z");
});
test("simultaneous visitors cannot reserve the same slot", async (t) => {
  const f = fixture(t);
  const results = await Promise.all([handleBooking(request(payload()), f.env, now), handleBooking(request(payload({ email: "second@example.com" })), f.env, now)]);
  assert.deepEqual(results.map((r) => r.status).sort(), [201, 409]);
  assert.equal(f.insertions(), 1);
});
test("duplicate submission returns the original event without leaking reservation data", async (t) => {
  const f = fixture(t); const body = payload();
  assert.equal((await handleBooking(request(body), f.env, now)).status, 201);
  const retry = await handleBooking(request(body), f.env, now); assert.equal(retry.status, 200);
  assert.deepEqual(Object.keys(await retry.json()).sort(), ["end", "meetStatus", "meetUrl", "start", "status"]);
  assert.equal(f.insertions(), 1);
});
test("uncertain Google write is reconciled on retry, never inserted twice", async (t) => {
  const f = fixture(t, { timeout: true }); const body = payload();
  assert.equal((await handleBooking(request(body), f.env, now)).status, 503);
  assert.equal(f.env.DB.db.prepare("SELECT state FROM call_bookings").get().state, "pending");
  assert.equal((await handleBooking(request(body), f.env, now)).status, 200);
  assert.equal(f.insertions(), 1);
});
test("cross-origin, tampered, and out-of-window requests do not send invitations", async (t) => {
  const f = fixture(t);
  assert.equal((await handleBooking(request(payload(), { Origin: "https://other.example" }), f.env, now)).status, 403);
  assert.equal((await handleBooking(request(payload({ start: "2026-10-01T14:00:00.000Z" })), f.env, now)).status, 409);
  assert.equal((await handleBooking(request(payload({ start: "2026-09-19T14:15:00.000Z" })), f.env, now)).status, 409);
  assert.equal(f.insertions(), 0);
});
test("migration includes database-enforced uniqueness", async () => {
  const sql = await readFile(new URL("../drizzle/0000_light_jack_flag.sql", import.meta.url), "utf8");
  const db = new DatabaseSync(":memory:");
  try { db.exec(sql); assert.ok(db.prepare("SELECT name FROM sqlite_master WHERE name = 'call_bookings_start_unique'").get()); } finally { db.close(); }
});

test("Vercel reservations use its trusted IP header and ignore forged Cloudflare headers", async (t) => {
  const f = fixture(t);
  f.env.VERCEL = "1";
  const missing = await handleBooking(request(payload()), f.env, now);
  assert.equal(missing.status, 503);
  assert.equal(f.insertions(), 0);
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await handleBooking(request(payload({ start: "2026-10-01T14:00:00.000Z" }), {
      "x-vercel-forwarded-for": "192.0.2.20", "CF-Connecting-IP": `192.0.2.${attempt}`,
    }), f.env, now);
    assert.equal(res.status, 409);
  }
  const limited = await handleBooking(request(payload(), { "x-vercel-forwarded-for": "192.0.2.20", "CF-Connecting-IP": "192.0.2.99" }), f.env, now);
  assert.equal(limited.status, 429);
  const accepted = await handleBooking(request(payload(), { "x-forwarded-for": "192.0.2.21" }), f.env, now);
  assert.equal(accepted.status, 201);
});

test("browser verification blocks bots, verified crawlers, bypasses, and verification errors", async () => {
  const human = { isHuman: true, isBot: false, isVerifiedBot: false, bypassed: false };
  assert.equal(await verifyBookingBrowser(async (options) => {
    assert.equal(options.advancedOptions.checkLevel, "basic");
    assert.equal(options.developmentOptions.isDevelopment, false);
    return human;
  }), null);
  for (const result of [{ ...human, isBot: true }, { ...human, isVerifiedBot: true }, { ...human, bypassed: true }, {}]) {
    const blocked = await verifyBookingBrowser(async () => result);
    assert.equal(blocked.status, 403);
    assert.equal(blocked.headers.get("cache-control"), "no-store");
  }
  const unavailable = await verifyBookingBrowser(async () => { throw new Error("verification outage"); });
  assert.equal(unavailable.status, 503);
  assert.equal((await unavailable.json()).code, "BROWSER_VERIFICATION_UNAVAILABLE");
});

test("email limit follows the recipient across IPs and Gmail aliases before Google is called", async (t) => {
  const f = fixture(t, { busy: [{ start: first, end: "2026-09-19T15:00:00.000Z" }] });
  const emails = ["person.name@gmail.com", "personname+one@gmail.com", "personname@googlemail.com", "person.name+two@gmail.com"];
  for (let i = 0; i < emails.length; i++) {
    const response = await handleBooking(request(payload({ email: emails[i] }), { "CF-Connecting-IP": `192.0.2.${i}` }), f.env, now);
    assert.equal(response.status, i < 3 ? 409 : 429);
  }
  assert.equal(f.insertions(), 0);
  const stored = JSON.stringify(f.env.DB.db.prepare("SELECT * FROM booking_rate_limits").all());
  assert.ok(!stored.includes("person") && !stored.includes("gmail") && !stored.includes("192.0.2."));
});

test("availability floods are limited before they reach Google", async (t) => {
  const f = fixture(t);
  let calls = 0;
  const googleFetch = globalThis.fetch;
  t.mock.method(globalThis, "fetch", (...args) => { calls++; return googleFetch(...args); });
  const availability = () => new Request("https://portfolio.example/api/booking/availability", { headers: { "CF-Connecting-IP": "192.0.2.30" } });
  for (let i = 0; i < 60; i++) assert.equal((await handleBooking(availability(), f.env, now)).status, 200);
  const before = calls;
  assert.equal((await handleBooking(availability(), f.env, now)).status, 429);
  assert.equal(calls, before);
});

test("malformed submissions consume IP quota and oversized bodies stop before Calendar access", async (t) => {
  const f = fixture(t);
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => { calls++; throw new Error("Google must not be called"); });
  const oversized = new Request("https://portfolio.example/api/booking/reserve", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://portfolio.example", "CF-Connecting-IP": "192.0.2.40" }, body: "x".repeat(6001) });
  assert.equal((await handleBooking(oversized, f.env, now)).status, 413);
  for (let i = 0; i < 5; i++) {
    const response = await handleBooking(request(payload({ website: "spam.example" })), f.env, now);
    assert.equal(response.status, 400);
  }
  assert.equal((await handleBooking(request(payload()), f.env, now)).status, 429);
  assert.equal(calls, 0);
});
