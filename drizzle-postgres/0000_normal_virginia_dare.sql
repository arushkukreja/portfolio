CREATE TABLE "booking_rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"expires_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "call_bookings" (
	"request_id" text PRIMARY KEY NOT NULL,
	"start" text NOT NULL,
	"end" text NOT NULL,
	"fingerprint" text NOT NULL,
	"event_id" text NOT NULL,
	"state" text NOT NULL,
	"created_at" bigint NOT NULL,
	CONSTRAINT "call_bookings_start_unique" UNIQUE("start")
);
