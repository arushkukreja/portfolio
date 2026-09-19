# Portfolio call scheduling

Booking page: `/book`. Calls are 30 minutes, starting every half hour from 10 a.m. through 1:30 p.m. America/New_York, daily. The window includes today through six days ahead; past start times are excluded. Timezone conversions account for daylight saving time. There is no buffer between calls.

## Google setup (owner only)

1. In your portfolio Google Cloud project, enable **Google Calendar API**.
2. Configure the Google Auth Platform branding and an External audience for a personal Gmail account. Only the owner authorizes this app; visitors never use Google OAuth.
3. Create an OAuth client of type **Web application**, with authorized redirect URI `http://localhost:4545/oauth/callback`. Download its JSON and keep it outside the source repository.
4. Move the OAuth app from Testing to In production before the permanent connection. Google expires Calendar refresh tokens issued in Testing after seven days. Follow any Google verification or consent requirements that apply to the account; do not bypass warnings automatically.
5. Run `node scripts/connect-google.mjs /absolute/path/to/downloaded-client.json` and open `http://localhost:4545`. Sign into the host's account and grant both requested Calendar permissions. This uses `calendar.events.owned` and `calendar.freebusy` and saves `.env.booking` privately, without printing tokens or overwriting an existing connection.
6. Save the values from `.env.booking` in the existing Sites project's production environment. Mark `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, and `BOOKING_HASH_SECRET` as secrets. Never put them in public frontend variables, hosting.json, Git, screenshots, or chat.
7. Deploy the saved source version to apply the environment and D1 migrations, then verify real availability and a booking the owner explicitly approves.

The required environment names are `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID` (normally `primary`), `BOOKING_HASH_SECRET`, and `BOOKING_ENABLED=true`. Optional `GOOGLE_BUSY_CALENDAR_IDS` is a comma-separated list of additional calendars that must also be free. The host's primary calendar alone does not include every other calendar displayed in their Google Calendar UI.

## Hosting and behavior

`.openai/hosting.json` requests the existing hosting platform's D1 binding `DB`; generated Drizzle migrations define cross-instance slot reservations and short-lived abuse limits. The public endpoints fail closed if credentials, database, or Calendar access are unavailable. They never return mock availability. Before connection, the page offers email contact.

Google Calendar sends invitation updates (`sendUpdates=all`) and requests a unique Google Meet conference per event. Guests may need to accept the invitation before it appears in their calendar. Some Google accounts can delay or refuse conference creation; the confirmation does not claim a link exists until Google provides it. No separate paid scheduler or email service is used. Standard Calendar API use is available at no additional cost; existing hosting/database limits still apply.

Concurrent website bookings for the same slot use a unique database constraint, and repeat submissions use the same request ID. After an ambiguous Google write timeout, the reservation stays held and a retry looks for the original event instead of creating another. Manual/external calendar edits can still race with the final check because Google has no atomic free/busy-and-insert operation.

Cancel/reschedule requests go by reply to the invitation or email in this first version. This is not a self-service management dashboard. A pending reservation with no matching Google event requires operator reconciliation before releasing it; do not automatically expire uncertain writes. The booking table stores no plaintext guest name, email, or notes.

## Checks

Run `node --test tests/booking.test.mjs`, `npm run build`, `npm run lint`, and the existing rendered-HTML tests after building. Test fixtures are confined to the tests; production always calls Google.

References: [Google Calendar quota and pricing](https://developers.google.com/workspace/calendar/api/guides/quota), [event insertion](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert), [Google OAuth web-server flow](https://developers.google.com/identity/protocols/oauth2/web-server).
