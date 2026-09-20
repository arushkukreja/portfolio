import { checkBotId } from "botid/server";

/** Called before any database query or Calendar request on Vercel. */
export async function verifyBookingBrowser(verify = checkBotId): Promise<Response | null> {
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  try {
    const result = await verify({
      advancedOptions: { checkLevel: "basic" },
      // Never inherit the SDK's automatic development-mode HUMAN bypass.
      developmentOptions: { isDevelopment: false },
    });
    if (result.isBot !== false || result.isHuman !== true || result.isVerifiedBot || result.bypassed) {
      return Response.json({
        code: "BROWSER_VERIFICATION_FAILED",
        error: "We couldn’t verify your browser. Refresh this page and try again, or email Arush to arrange a call.",
      }, { status: 403, headers });
    }
    return null;
  } catch {
    return Response.json({
      code: "BROWSER_VERIFICATION_UNAVAILABLE",
      error: "Browser verification is temporarily unavailable. Refresh this page and try again, or email Arush to arrange a call.",
    }, { status: 503, headers });
  }
}
