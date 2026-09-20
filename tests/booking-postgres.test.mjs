import assert from "node:assert/strict";
import test from "node:test";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { build } from "esbuild";

// Opt-in integration test against the configured database. Only synthetic
// far-future reservations are created; all are removed in finally.
test("Postgres enforces one claim across independent connections and binds guest values", {
  skip: !process.env.BOOKING_DATABASE_TEST_URL,
}, async () => {
  const folder = new URL("../.vercel/booking-tests/", import.meta.url);
  await mkdir(folder, { recursive: true });
  const result = await build({ entryPoints: [new URL("../lib/booking-postgres.ts", import.meta.url).pathname], bundle: true, write: false, platform: "node", format: "esm", packages: "external" });
  const moduleFile = new URL("adapter.mjs", folder);
  await writeFile(moduleFile, result.outputFiles[0].text);
  const { createPostgresBookingDatabase } = await import(moduleFile.href);
  const connections = Array.from({ length: 12 }, () => createPostgresBookingDatabase(process.env.BOOKING_DATABASE_TEST_URL));
  const db = connections[0];
  const ids = connections.map(() => crypto.randomUUID());
  const start = `2099-01-01T00:00:00.000Z:test:${crypto.randomUUID()}`;
  const fingerprint = "a quoted ' value; DROP TABLE call_bookings; --";
  const rateKey = `integration-test:${crypto.randomUUID()}`;
  try {
    const claims = await Promise.all(connections.map((connection, i) => connection.prepare('INSERT INTO call_bookings (request_id, start, "end", fingerprint, event_id, state, created_at) VALUES (?, ?, ?, ?, ?, \'pending\', ?) ON CONFLICT DO NOTHING')
      .bind(ids[i], start, start, fingerprint, ids[i], Date.now()).run()));
    assert.equal(claims.reduce((sum, claim) => sum + claim.meta.changes, 0), 1);
    const { results: rows } = await db.prepare("SELECT * FROM call_bookings WHERE start = ?").bind(start).all();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].fingerprint, fingerprint);
    const id = rows[0].request_id;
    assert.equal((await db.prepare("UPDATE call_bookings SET state = 'confirmed' WHERE request_id = ?").bind(id).run()).meta.changes, 1);
    assert.equal((await db.prepare("SELECT state FROM call_bookings WHERE request_id = ?").bind(id).first()).state, "confirmed");
    const counts = await Promise.all(connections.map((connection) => connection.prepare("INSERT INTO booking_rate_limits (key, count, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = booking_rate_limits.count + 1 RETURNING count")
      .bind(rateKey, Date.now() + 3600000).first()));
    assert.deepEqual(counts.map(r => r.count).sort((a, b) => a - b), Array.from({ length: 12 }, (_, i) => i + 1));
  } finally {
    await db.prepare("DELETE FROM call_bookings WHERE start = ?").bind(start).run();
    await db.prepare("DELETE FROM booking_rate_limits WHERE key = ?").bind(rateKey).run();
    await rm(moduleFile, { force: true });
  }
});
