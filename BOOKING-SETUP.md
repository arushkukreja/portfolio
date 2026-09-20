# Portfolio call scheduling

Booking page: `/book`. Calls are 30 minutes, starting every half hour from 10 a.m. through 1:30 p.m. America/New_York, daily. The window includes today through six days ahead; past start times are excluded. Timezone conversions account for daylight saving time. There is no buffer between calls.

## Google setup (owner only)

1. In your portfolio Google Cloud project, enable **Google Calendar API**.
2. Configure the Google Auth Platform branding and an External audience for a personal Gmail account. Only the owner authorizes this app; visitors never use Google OAuth.
3. Create an OAuth client of type **Web application**, with authorized redirect URI `http://localhost:4545/oauth/callback`. Download its JSON and keep it outside the source repository.
4. Move the OAuth app from Testing to In production before the permanent connection. Google expires Calendar refresh tokens issued in Testing after seven days. Follow any Google verification or consent requirements that apply to the account; do not bypass warnings automatically.
5. Run `node scripts/connect-google.mjs /absolute/path/to/downloaded-client.json` and open `http://localhost:4545`. Sign into the host's account and grant both requested Calendar permissions. This uses `calendar.events.owned` and `calendar.freebusy` and saves `.env.booking` privately, without printing tokens or overwriting an existing connection.
6. Save the values from `.env.booking` in the Vercel `portfolio` project's **production** environment using `vercel env add`. Mark `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, and `BOOKING_HASH_SECRET` as secrets. Pass values through stdin, never command-line arguments. Never put them in public frontend variables, hosting.json, Git, screenshots, or chat.
7. Apply the Postgres migrations below, then push the saved source version to GitHub `main` to deploy. Verify real availability and a booking the owner explicitly approves.

The required environment names are `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID` (normally `primary`), `BOOKING_HASH_SECRET`, and `BOOKING_ENABLED=true`. Optional `GOOGLE_BUSY_CALENDAR_IDS` is a comma-separated list of additional calendars that must also be free. The host's primary calendar alone does not include every other calendar displayed in their Google Calendar UI.

## Hosting and behavior

Production uses the Vercel Marketplace Neon resource `portfolio-bookings` on its free plan, in the Washington region, connected only to production. `DATABASE_URL` is the pooled runtime connection and `DATABASE_URL_UNPOOLED` is the direct migration connection. The server-only Postgres adapter preserves parameterized queries and returns the affected-row count used for the reservation lock. Vercel's trusted forwarding header supplies the rate-limit address; a visitor-supplied Cloudflare header is ignored there.

The schema lives in `db/postgres-schema.ts`, and Drizzle migration history is in `drizzle-postgres/`. To generate and apply future migrations:

```bash
npx drizzle-kit generate --config drizzle.postgres.config.ts
vercel env pull .env.production.local --environment=production --yes
node --env-file=.env.production.local scripts/migrate-booking-postgres.mjs
```

Review and test schema changes before applying them to a database with live bookings. Keep downloaded configuration files private and Git-ignored. Preview deployments have no production calendar credentials. The original Cloudflare target still uses `.openai/hosting.json`, its D1 binding `DB`, and the SQLite migrations under `drizzle/`.

The public endpoints fail closed if credentials, database, or Calendar access are unavailable. They never return mock availability. Before connection, the page offers email contact.

## Spam protection

On Vercel, both availability and reservation endpoints require BotID Basic browser verification before any database or Calendar calls. Basic is the free tier; the client and server explicitly select it. The booking component initializes the browser challenge before fetching availability, and `vercel.json` routes the challenge through the same domain. No user-agent allowlist, public bypass token, or automatic acceptance of verified crawlers is used. Verification errors fail closed with an email fallback. Local Cloudflare development does not call Vercel BotID.

Shared database counters enforce 5 reservation attempts per IP per 10-minute window, 10 per IP per hour, and 3 new valid-slot attempts per email per UTC day. Retries for the same reservation do not consume the email quota again. Gmail dot/plus aliases share an email counter. Availability is limited to 60 refreshes per IP per 10-minute window. These are fixed windows, so requests close to a window boundary can straddle two limits. Only keyed hashes are stored, with cleanup on the next availability check after expiry (at most 48 hours for daily counters). Bodies are limited to 6,000 bytes while streaming, including when Content-Length is absent. The existing origin check, hidden honeypot, and reservation uniqueness remain in place.

Test BotID from the actual booking page on a Vercel deployment: direct command-line API calls are expected to receive 403. Local unit tests cover accepted humans, rejected bots, verification outages, email/IP quotas, and oversized requests. Basic bot verification reduces scripted abuse but does not prove email ownership or stop every sophisticated browser-based bot; this version does not require email confirmation.

Google Calendar sends invitation updates (`sendUpdates=all`) and requests a unique Google Meet conference per event. Guests may need to accept the invitation before it appears in their calendar. Some Google accounts can delay or refuse conference creation; the confirmation does not claim a link exists until Google provides it. No separate paid scheduler or email service is used. Standard Calendar API use is available at no additional cost; existing hosting/database limits still apply.

Concurrent website bookings for the same slot use a unique database constraint, and repeat submissions use the same request ID. After an ambiguous Google write timeout, the reservation stays held and a retry looks for the original event instead of creating another. Manual/external calendar edits can still race with the final check because Google has no atomic free/busy-and-insert operation.

Cancel/reschedule requests go by reply to the invitation or email in this first version. This is not a self-service management dashboard. A pending reservation with no matching Google event requires operator reconciliation before releasing it; do not automatically expire uncertain writes. The booking table stores no plaintext guest name, email, or notes.

## Checks

Run `node --test tests/booking.test.mjs`, `NITRO_PRESET=vercel npx vite build`, `node --test tests/vercel-output.test.mjs`, `npm run lint`, and `npx tsc --noEmit`. The opt-in `tests/booking-postgres.test.mjs` uses `BOOKING_DATABASE_TEST_URL` to test simultaneous claims through independent database connections, then removes its synthetic test rows. It sends no invitations. Test fixtures are confined to tests; production always calls Google.

References: [Google Calendar quota and pricing](https://developers.google.com/workspace/calendar/api/guides/quota), [event insertion](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert), [Google OAuth web-server flow](https://developers.google.com/identity/protocols/oauth2/web-server).
