// Owner-only, loopback OAuth setup. Credentials never reach the public website UI.
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { randomBytes, timingSafeEqual } from "node:crypto";

const clientFile = process.argv[2];
if (!clientFile) throw new Error("Pass the path to the downloaded Google web OAuth client JSON.");
const credentials = JSON.parse(await readFile(clientFile, "utf8")).web;
if (!credentials?.client_id || !credentials?.client_secret) throw new Error("Expected a Google OAuth Web application client JSON.");
const redirectUri = "http://localhost:4545/oauth/callback";
if (!credentials.redirect_uris?.includes(redirectUri)) throw new Error(`Add ${redirectUri} to this client's authorized redirect URIs.`);
const state = randomBytes(32).toString("hex");
const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
auth.search = new URLSearchParams({ client_id: credentials.client_id, redirect_uri: redirectUri,
  response_type: "code", access_type: "offline", prompt: "consent", state,
  scope: "https://www.googleapis.com/auth/calendar.events.owned https://www.googleapis.com/auth/calendar.freebusy" }).toString();
let exchanging = false;
const page = (message) => `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connect portfolio calendar</title><body style="background:#f2eddf;color:#171713;font:16px/1.8 monospace;max-width:640px;margin:80px auto;padding:24px"><h1>Connect your portfolio calendar</h1>${message}</body></html>`;
const server = createServer(async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (req.headers.host !== "localhost:4545" || req.method !== "GET") { res.writeHead(403).end("Forbidden"); return; }
  const url = new URL(req.url, "http://localhost:4545");
  if (url.pathname === "/") {
    res.setHeader("Set-Cookie", `calendar_setup=${state}; HttpOnly; SameSite=Lax; Path=/; Max-Age=900`);
    res.end(page(`<p>Connect the Google account whose calendar should receive your calls. This allows the scheduler to check availability and create events with Google Meet links.</p><p>Only you do this step. Visitors do not connect a Google account.</p><a href="${auth.href.replaceAll("&", "&amp;")}">Connect Google Calendar →</a>`)); return;
  }
  if (url.pathname !== "/oauth/callback") { res.writeHead(404).end("Not found"); return; }
  const supplied = url.searchParams.get("state") || "";
  const cookie = req.headers.cookie?.split(";").map((c) => c.trim()).find((c) => c.startsWith("calendar_setup="))?.slice(15);
  if (supplied.length !== state.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(state)) || cookie !== state || exchanging) { res.writeHead(403).end("Invalid or expired setup session. Start again from localhost:4545."); return; }
  if (url.searchParams.has("error")) { res.writeHead(400).end(page("<p>Google access was not granted. You can close this page and try again when ready.</p>")); return; }
  const code = url.searchParams.get("code");
  if (!code) { res.writeHead(400).end("Missing authorization code."); return; }
  exchanging = true;
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", signal: AbortSignal.timeout(15000), body: new URLSearchParams({
      client_id: credentials.client_id, client_secret: credentials.client_secret, code, redirect_uri: redirectUri, grant_type: "authorization_code",
    }) });
    const tokens = await response.json();
    if (!response.ok || !tokens.refresh_token) throw new Error("Google did not return a refresh token. Reconnect with consent enabled.");
    const grants = new Set((tokens.scope || "").split(" "));
    if (!grants.has("https://www.googleapis.com/auth/calendar.events.owned") || !grants.has("https://www.googleapis.com/auth/calendar.freebusy")) throw new Error("Both calendar permissions must be granted.");
    const values = { GOOGLE_CLIENT_ID: credentials.client_id, GOOGLE_CLIENT_SECRET: credentials.client_secret,
      GOOGLE_REFRESH_TOKEN: tokens.refresh_token, GOOGLE_CALENDAR_ID: "primary", BOOKING_HASH_SECRET: randomBytes(32).toString("hex"), BOOKING_ENABLED: "true" };
    await writeFile(new URL("../.env.booking", import.meta.url), Object.entries(values).map(([k,v]) => `${k}=${JSON.stringify(v)}`).join("\n") + "\n", { mode: 0o600, flag: "wx" });
    res.end(page("<p><strong>Your Google connection is saved securely on this computer.</strong></p><p>Return to Codex to finish connecting the portfolio. This page can be closed.</p>"));
    console.log("Google connection saved to the ignored .env.booking file. No credentials were printed.");
    server.close();
  } catch (error) {
    res.writeHead(500).end(page("<p>Setup could not finish. Return to Codex to check the connection. No secret values are displayed here.</p>"));
    console.error(error?.code === "EEXIST" ? "An existing .env.booking file was preserved. Use the existing connection or explicitly replace it." : "Google connection failed; no credentials were printed.");
    server.close();
  }
});
server.listen(4545, "127.0.0.1", () => console.log("Open http://localhost:4545 to connect your calendar. This session expires in 15 minutes."));
setTimeout(() => { server.close(); }, 15 * 60 * 1000).unref();
