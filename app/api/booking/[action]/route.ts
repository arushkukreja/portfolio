import { handleBooking, type BookingEnv } from "@/lib/booking-api";
import { createPostgresBookingDatabase } from "@/lib/booking-postgres";

// Cloudflare handles these paths in worker/index.ts with its D1 binding.
// Initialize lazily so builds and unconfigured previews need no credentials.
let database: BookingEnv["DB"];
function environment(): BookingEnv {
  if (!database && process.env.DATABASE_URL) {
    database = createPostgresBookingDatabase(process.env.DATABASE_URL);
  }
  return { ...process.env, DB: database };
}

export function GET(request: Request) {
  return handleBooking(request, environment());
}

export function POST(request: Request) {
  return handleBooking(request, environment());
}
