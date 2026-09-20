import { candidateSlots, HOST_TIME_ZONE, overlaps, parseBooking, type Slot } from "./scheduling";

interface Statement {
  bind(...values: (string | number | null)[]): Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<{ meta: { changes: number } }>;
}
export interface BookingEnv {
  DB?: { prepare(sql: string): Statement };
  VERCEL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REFRESH_TOKEN?: string;
  GOOGLE_CALENDAR_ID?: string;
  GOOGLE_BUSY_CALENDAR_IDS?: string;
  BOOKING_HASH_SECRET?: string;
  BOOKING_ENABLED?: string;
}
type StoredBooking = { request_id: string; start: string; end: string; fingerprint: string; event_id: string; state: string; created_at: number };
type GoogleEvent = { id: string; status?: string; hangoutLink?: string; htmlLink?: string; conferenceData?: { createRequest?: { status?: { statusCode?: string } } } };
class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
const unavailable = "Online booking is temporarily unavailable. Please email Arush to arrange a call.";

function configured(env: BookingEnv) {
  return env.BOOKING_ENABLED === "true" && env.DB && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REFRESH_TOKEN && env.BOOKING_HASH_SECRET;
}
async function digest(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))), (b) => b.toString(16).padStart(2, "0")).join("");
}
async function accessToken(env: BookingEnv) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", signal: AbortSignal.timeout(10000),
    body: new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID!, client_secret: env.GOOGLE_CLIENT_SECRET!, refresh_token: env.GOOGLE_REFRESH_TOKEN!, grant_type: "refresh_token" }),
  });
  if (!res.ok) throw new ApiError(503, unavailable);
  const data = await res.json() as { access_token?: string };
  if (!data.access_token) throw new ApiError(503, unavailable);
  return data.access_token;
}
async function google(token: string, path: string, options: RequestInit = {}) {
  return fetch(`https://www.googleapis.com/calendar/v3/${path}`, {
    ...options, signal: AbortSignal.timeout(12000), headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
}
function eventPath(env: BookingEnv, eventId?: string) {
  return `calendars/${encodeURIComponent(env.GOOGLE_CALENDAR_ID || "primary")}/events${eventId ? `/${eventId}` : ""}`;
}
async function busyTimes(env: BookingEnv, token: string, slots: Slot[]) {
  if (!slots.length) return [];
  const ids = [...new Set([env.GOOGLE_CALENDAR_ID || "primary", ...(env.GOOGLE_BUSY_CALENDAR_IDS || "").split(",").map((s) => s.trim()).filter(Boolean)])];
  const res = await google(token, "freeBusy", { method: "POST", body: JSON.stringify({
    timeMin: slots[0].start, timeMax: slots[slots.length - 1].end, timeZone: HOST_TIME_ZONE, items: ids.map((id) => ({ id })),
  }) });
  if (!res.ok) throw new ApiError(503, unavailable);
  const data = await res.json() as { calendars?: Record<string, { busy?: Slot[]; errors?: unknown[] }> };
  const busy: Slot[] = [];
  for (const id of ids) {
    const cal = data.calendars?.[id];
    if (!cal || cal.errors?.length || !Array.isArray(cal.busy)) throw new ApiError(503, unavailable);
    for (const range of cal.busy) {
      if (!Number.isFinite(Date.parse(range.start)) || !Number.isFinite(Date.parse(range.end))) throw new ApiError(503, unavailable);
      busy.push(range);
    }
  }
  return busy;
}
async function getEvent(env: BookingEnv, token: string, id: string) {
  const res = await google(token, eventPath(env, id));
  if (res.status === 404 || res.status === 410) return null;
  if (!res.ok) throw new ApiError(503, "We are still checking your booking. Please retry with the same details.");
  return await res.json() as GoogleEvent;
}
function confirmation(event: GoogleEvent, slot: Slot) {
  return { status: "confirmed", start: slot.start, end: slot.end, meetUrl: event.hangoutLink || null,
    meetStatus: event.hangoutLink ? "ready" : event.conferenceData?.createRequest?.status?.statusCode === "failure" ? "failed" : "pending" };
}
const escapeText = (text: string) => text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
function clientAddress(request: Request, env: BookingEnv) {
  // Trust the deployed platform's ingress header, never a visitor-supplied
  // Cloudflare header on Vercel. Only a keyed hash is stored.
  const address = env.VERCEL === "1"
    ? request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")
    : request.headers.get("CF-Connecting-IP");
  if (!address) {
    if (!['localhost', '127.0.0.1'].includes(new URL(request.url).hostname)) throw new ApiError(503, unavailable);
    return;
  }
  return address;
}
async function consumeLimit(env: BookingEnv, now: Date, scope: string, identity: string, windowMs: number, limit: number) {
  const bucket = Math.floor(now.getTime() / windowMs);
  const key = await digest(`${scope}:${bucket}:${identity}`, env.BOOKING_HASH_SECRET!);
  const row = await env.DB!.prepare("INSERT INTO booking_rate_limits (key, count, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = booking_rate_limits.count + 1 RETURNING count")
    .bind(key, (bucket + 2) * windowMs).first<{ count: number }>();
  if (!row || row.count > limit) throw new ApiError(429, "Too many requests. Please try again later or email Arush to arrange a call.");
}
async function rateLimit(request: Request, env: BookingEnv, now: Date, availability = false) {
  const address = clientAddress(request, env);
  if (!address) return;
  if (availability) {
    await consumeLimit(env, now, "availability", address, 10 * 60000, 60);
  } else {
    await consumeLimit(env, now, "reserve-burst", address, 10 * 60000, 5);
    await consumeLimit(env, now, "reserve-hour", address, 3600000, 10);
  }
}
async function readBookingBody(request: Request) {
  const maxBytes = 6000;
  if (Number(request.headers.get("content-length")) > maxBytes) throw new ApiError(413, "Please shorten your message.");
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, "Please check your booking details.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) {
        await reader.cancel();
        throw new ApiError(413, "Please shorten your message.");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(body);
}

async function book(request: Request, env: BookingEnv, now: Date) {
  if (request.headers.get("origin") !== new URL(request.url).origin) throw new ApiError(403, "Please book directly from this website.");
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new ApiError(415, "Please use the booking form.");
  await rateLimit(request, env, now);
  const raw = await readBookingBody(request);
  let body: unknown;
  try { body = JSON.parse(raw); } catch { throw new ApiError(400, "Please check your booking details."); }
  const input = parseBooking(body);
  if (!input) throw new ApiError(400, "Please enter a valid name, email, time, and discussion topic.");
  const fingerprint = await digest(JSON.stringify(input), env.BOOKING_HASH_SECRET!);
  const existing = await env.DB!.prepare("SELECT * FROM call_bookings WHERE request_id = ?").bind(input.requestId).first<StoredBooking>();
  if (existing && existing.fingerprint !== fingerprint) throw new ApiError(409, "This booking request has changed. Please refresh the page.");
  if (existing) {
    const token = await accessToken(env);
    const event = await getEvent(env, token, existing.event_id);
    if (event && event.status !== "cancelled") {
      await env.DB!.prepare("UPDATE call_bookings SET state = 'confirmed' WHERE request_id = ?").bind(input.requestId).run();
      return json(confirmation(event, existing));
    }
    // Never release an uncertain write or re-send it: Google may still finish it.
    throw new ApiError(409, "This request is still being checked. Please email Arush before trying another time.");
  }
  const slot = candidateSlots(now).find((s) => s.start === input.start);
  if (!slot) throw new ApiError(409, "That time is no longer available. Please choose another.");
  // Normalize Gmail aliases to one private rate-limit identity. The actual
  // invitation still goes to the exact address supplied by the visitor.
  const [local, domain] = input.email.split("@");
  const emailIdentity = ["gmail.com", "googlemail.com"].includes(domain)
    ? `${local.split("+")[0].replaceAll(".", "")}@gmail.com` : input.email;
  await consumeLimit(env, now, "reserve-email", emailIdentity, 86400000, 3);
  const token = await accessToken(env);
  const busy = await busyTimes(env, token, [slot]);
  if (busy.some((b) => overlaps(slot, b))) throw new ApiError(409, "That time was just taken. Please choose another.");
  const eventId = crypto.randomUUID().replaceAll("-", "");
  const claim = await env.DB!.prepare('INSERT INTO call_bookings (request_id, start, "end", fingerprint, event_id, state, created_at) VALUES (?, ?, ?, ?, ?, \'pending\', ?) ON CONFLICT DO NOTHING')
    .bind(input.requestId, slot.start, slot.end, fingerprint, eventId, now.getTime()).run();
  if (!claim.meta.changes) throw new ApiError(409, "That time was just selected. Please refresh availability.");
  // The unique start constraint is the cross-instance lock. Recheck Google after it.
  let res: Response;
  try {
    const fresh = await busyTimes(env, token, [slot]);
    if (fresh.some((b) => overlaps(slot, b))) {
      await env.DB!.prepare("DELETE FROM call_bookings WHERE request_id = ? AND state = 'pending'").bind(input.requestId).run();
      throw new ApiError(409, "That time was just taken. Please choose another.");
    }
  } catch (error) {
    // No event write has started, so this particular claim is safe to release.
    await env.DB!.prepare("DELETE FROM call_bookings WHERE request_id = ? AND state = 'pending'").bind(input.requestId).run();
    throw error;
  }
  try {
    res = await google(token, `${eventPath(env)}?conferenceDataVersion=1&sendUpdates=all`, { method: "POST", body: JSON.stringify({
      id: eventId, summary: `Call with ${input.name} · Arush Kukreja`,
      description: `Booked through Arush’s portfolio.\n\n${escapeText(input.notes || "Introductory conversation")}\n\nVisitor timezone: ${escapeText(input.timeZone)}\nTo cancel or reschedule, reply to the calendar invitation.`,
      start: { dateTime: slot.start, timeZone: HOST_TIME_ZONE }, end: { dateTime: slot.end, timeZone: HOST_TIME_ZONE },
      attendees: [{ email: input.email, displayName: input.name }], transparency: "opaque",
      guestsCanInviteOthers: false, guestsCanModify: false,
      conferenceData: { createRequest: { requestId: eventId, conferenceSolutionKey: { type: "hangoutsMeet" } } },
      reminders: { useDefault: true },
    }) });
  } catch { throw new ApiError(503, "Google is taking longer to confirm. Retry with the same details; your time is being held."); }
  if (!res.ok) {
    // A rejected request did not create an event. Timeouts/5xx remain held for reconciliation.
    if ([400, 401, 403, 404, 422, 429].includes(res.status)) {
      await env.DB!.prepare("DELETE FROM call_bookings WHERE request_id = ? AND state = 'pending'").bind(input.requestId).run();
    }
    throw new ApiError(503, "We could not confirm the booking. Retry with the same details or email Arush.");
  }
  const event = await res.json() as GoogleEvent;
  await env.DB!.prepare("UPDATE call_bookings SET state = 'confirmed' WHERE request_id = ?").bind(input.requestId).run();
  return json(confirmation(event, slot), 201);
}

export async function handleBooking(request: Request, env: BookingEnv, now = new Date()) {
  try {
    const path = new URL(request.url).pathname;
    if (path !== "/api/booking/availability" && path !== "/api/booking/reserve") return json({ error: "Not found" }, 404);
    if (!configured(env)) return json({ error: unavailable }, 503);
    if (path === "/api/booking/reserve" && request.method === "POST") return await book(request, env, now);
    if (path === "/api/booking/availability" && request.method === "GET") {
      await rateLimit(request, env, now, true);
      const slots = candidateSlots(now);
      const token = await accessToken(env);
      const busy = await busyTimes(env, token, slots);
      const held = await env.DB!.prepare('SELECT start, "end" FROM call_bookings WHERE "end" > ?').bind(now.toISOString()).all<Slot>();
      // Keep past reservation metadata only for 30 days; it contains no plaintext guest data.
      await env.DB!.prepare('DELETE FROM call_bookings WHERE "end" < ?').bind(new Date(now.getTime() - 30 * 86400000).toISOString()).run();
      await env.DB!.prepare("DELETE FROM booking_rate_limits WHERE expires_at < ?").bind(now.getTime()).run();
      return json({ slots: slots.filter((s) => ![...busy, ...held.results].some((b) => overlaps(s, b))), hostTimeZone: HOST_TIME_ZONE, duration: 30 });
    }
    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    return json({ error: error instanceof ApiError ? error.message : unavailable }, error instanceof ApiError ? error.status : 503);
  }
}
