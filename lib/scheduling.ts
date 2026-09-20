export const HOST_TIME_ZONE = "America/New_York";
export const CALL_MINUTES = 30;
export const CONTACT_EMAIL = "arushkukrejaa@gmail.com";
export type Slot = { start: string; end: string };

export function dateKey(date: Date, timeZone = HOST_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

// Convert each local date separately so the window stays at 10–14 across DST.
function easternTime(day: string, hour: number, minute: number) {
  const wall = Date.parse(`${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00Z`);
  const offset = new Intl.DateTimeFormat("en-US", { timeZone: HOST_TIME_ZONE, timeZoneName: "longOffset" })
    .formatToParts(new Date(wall)).find((p) => p.type === "timeZoneName")!.value;
  return new Date(`${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00${offset.replace("GMT", "")}`).toISOString();
}

/** Today through six days ahead, excluding times that have already started. */
export function candidateSlots(now = new Date()): Slot[] {
  const today = dateKey(now);
  const slots: Slot[] = [];
  for (let day = 0; day < 7; day++) {
    const key = new Date(Date.parse(`${today}T12:00:00Z`) + day * 86400000).toISOString().slice(0, 10);
    for (let minutes = 600; minutes < 840; minutes += CALL_MINUTES) {
      const start = easternTime(key, Math.floor(minutes / 60), minutes % 60);
      if (Date.parse(start) <= now.getTime()) continue;
      slots.push({ start, end: new Date(Date.parse(start) + CALL_MINUTES * 60000).toISOString() });
    }
  }
  return slots;
}

export function overlaps(a: Slot, b: Slot) {
  return Date.parse(a.start) < Date.parse(b.end) && Date.parse(b.start) < Date.parse(a.end);
}

export type BookingInput = { requestId: string; start: string; name: string; email: string; notes: string; timeZone: string };
export function parseBooking(value: unknown): BookingInput | null {
  if (!value || typeof value !== "object") return null;
  const b = value as Record<string, unknown>;
  if (b.website || typeof b.requestId !== "string" || !/^[a-f0-9-]{36}$/.test(b.requestId)
    || typeof b.start !== "string" || typeof b.name !== "string" || typeof b.email !== "string"
    || typeof b.timeZone !== "string" || typeof b.notes !== "string") return null;
  const name = b.name.trim();
  const email = b.email.trim().toLowerCase();
  const notes = b.notes.trim();
  if (!name || name.length > 100 || [...name].some((c) => c.charCodeAt(0) < 32) || email.length > 254
    || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || !notes || notes.length > 1500) return null;
  try { new Intl.DateTimeFormat("en-US", { timeZone: b.timeZone }); } catch { return null; }
  return { requestId: b.requestId, start: b.start, name, email, notes, timeZone: b.timeZone };
}
