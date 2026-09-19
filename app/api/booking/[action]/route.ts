import { handleBooking, type BookingEnv } from "@/lib/booking-api";

// Cloudflare handles these paths in worker/index.ts with its D1 binding.
// On Vercel, preserve the API's unavailable response until durable booking
// storage and the owner's Calendar credentials have been configured.
export function GET(request: Request) {
  return handleBooking(request, process.env as BookingEnv);
}

export function POST(request: Request) {
  return handleBooking(request, process.env as BookingEnv);
}
