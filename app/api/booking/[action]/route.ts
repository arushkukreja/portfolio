import { handleBooking, type BookingEnv } from "@/lib/booking-api";
import { createPostgresBookingDatabase } from "@/lib/booking-postgres";
import { verifyBookingBrowser } from "@/lib/booking-bot-protection";

// Cloudflare handles these paths in worker/index.ts with its D1 binding.
// Initialize lazily so builds and unconfigured previews need no credentials.
let database: BookingEnv["DB"];
function environment(): BookingEnv {
  if (!database && process.env.DATABASE_URL) {
    database = createPostgresBookingDatabase(process.env.DATABASE_URL);
  }
  return { ...process.env, DB: database };
}

export async function GET(request: Request) {
  if (process.env.VERCEL === "1") {
    const rejected = await verifyBookingBrowser();
    if (rejected) return rejected;
  }
  return handleBooking(request, environment());
}

export async function POST(request: Request) {
  if (process.env.VERCEL === "1") {
    const rejected = await verifyBookingBrowser();
    if (rejected) return rejected;
  }
  return handleBooking(request, environment());
}
