import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const callBookings = sqliteTable("call_bookings", {
  requestId: text("request_id").primaryKey(),
  start: text("start").notNull().unique(),
  end: text("end").notNull(),
  fingerprint: text("fingerprint").notNull(),
  eventId: text("event_id").notNull(),
  state: text("state").notNull(),
  createdAt: integer("created_at").notNull(),
});
export const bookingRateLimits = sqliteTable("booking_rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
