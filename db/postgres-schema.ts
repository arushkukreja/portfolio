import { bigint, integer, pgTable, text } from "drizzle-orm/pg-core";

export const callBookings = pgTable("call_bookings", {
  requestId: text("request_id").primaryKey(),
  start: text("start").notNull().unique(),
  end: text("end").notNull(),
  fingerprint: text("fingerprint").notNull(),
  eventId: text("event_id").notNull(),
  state: text("state").notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const bookingRateLimits = pgTable("booking_rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
});
