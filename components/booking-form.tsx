"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { CONTACT_EMAIL, dateKey, type Slot } from "../lib/scheduling";

type Confirmation = Slot & { meetUrl: string | null; meetStatus: "ready" | "pending" | "failed" };
type RequestDetails = { requestId: string; start: string; name: string; email: string; notes: string; timeZone: string; website: string };
const formatTime = (date: string, timeZone: string) => new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(new Date(date));
const formatDate = (date: string, timeZone: string) => new Intl.DateTimeFormat("en-US", { timeZone, weekday: "long", month: "long", day: "numeric" }).format(new Date(date));
const subscribeTimezone = () => () => {};
const detectTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
const serverTimezone = () => "";

export function BookingForm() {
  const detectedTimezone = useSyncExternalStore(subscribeTimezone, detectTimezone, serverTimezone);
  const [chosenTimezone, setTimeZone] = useState("");
  const timeZone = chosenTimezone || detectedTimezone;
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Confirmation | null>(null);
  const [uncertain, setUncertain] = useState(false);
  const [revision, setRevision] = useState(0);
  const payload = useRef<RequestDetails | null>(null);
  const focusTarget = useRef<HTMLHeadingElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (!timeZone || confirmed || slot) return;
    const controller = new AbortController();
    fetch("/api/booking/availability", { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(35000)]), cache: "no-store" })
      .then(async (res) => {
        const data = await res.json() as { error?: string; slots: Slot[] };
        if (!res.ok) throw new Error(data.error || "We couldn’t load availability. Please try again.");
        setSlots(data.slots); setError("");
        setSelectedDate(data.slots.length ? dateKey(new Date(data.slots[0].start), timeZone) : "");
      })
      .catch((err) => { if (!controller.signal.aborted) { setSlots([]); setError(err instanceof Error ? err.message : "Please try again."); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [timeZone, revision, confirmed, slot]);
  useEffect(() => { if (slot || confirmed) focusTarget.current?.focus(); }, [slot, confirmed]);

  async function reserve(event: FormEvent) {
    event.preventDefault();
    if (!slot || submitting) return;
    setSubmitting(true); setError("");
    payload.current ??= { requestId: crypto.randomUUID(), start: slot.start, name, email, notes, timeZone, website };
    try {
      const res = await fetch("/api/booking/reserve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload.current), signal: AbortSignal.timeout(45000) });
      const data = await res.json() as Confirmation & { error?: string };
      if (!res.ok) {
        if (res.status === 409 && /another|refresh availability/.test(data.error || "")) {
          setSlot(null); setLoading(true); payload.current = null; setUncertain(false); setRevision((n) => n + 1);
        } else if ([400, 403, 413, 415, 429].includes(res.status)) {
          payload.current = null; setUncertain(false);
        } else setUncertain(true);
        throw new Error(data.error || "We couldn’t confirm your booking.");
      }
      setConfirmed(data); setUncertain(false);
    } catch (err) {
      if (payload.current) setUncertain(true);
      setError(err instanceof Error && err.name !== "TimeoutError" ? err.message : "Confirmation is taking longer than expected. Retry with the same details.");
    } finally { setSubmitting(false); }
  }

  const days = [...new Set(slots.map((s) => dateKey(new Date(s.start), timeZone || "America/New_York")))];
  const emailLink = <a href={`mailto:${CONTACT_EMAIL}`}>Email Arush ↗</a>;
  if (confirmed) return <div className="booking-success">
    <span className="booking-success-mark" aria-hidden="true">✓</span><p className="booking-eyebrow">YOU’RE BOOKED</p>
    <h2 ref={focusTarget} tabIndex={-1}>See you soon, {name.split(" ")[0]}.</h2>
    <p>{formatDate(confirmed.start, timeZone)}<br /><strong>{formatTime(confirmed.start, timeZone)}–{formatTime(confirmed.end, timeZone)}</strong><br /><small>{timeZone.replaceAll("_", " ")}</small></p>
    <p>A calendar invitation has been requested for <strong>{email}</strong>. Check your inbox and spam folder, then accept it to add the call to your calendar.</p>
    {confirmed.meetUrl ? <a className="booking-primary" href={confirmed.meetUrl} target="_blank" rel="noreferrer">Open Google Meet ↗</a> : <p>{confirmed.meetStatus === "failed" ? "Your call is booked, but Google couldn’t create a Meet link. Please email Arush for the meeting details." : "Google is preparing your Meet link. It will appear in the calendar event."}</p>}
    <p className="booking-small">Need to cancel or reschedule? Reply to your invitation or {emailLink}.</p>
  </div>;

  return <>
    <div className="booking-step"><span>{slot ? "02 / YOUR DETAILS" : "01 / FIND A TIME"}</span><span>30 MIN</span></div>
    <h2 ref={focusTarget} tabIndex={-1}>{slot ? "Let’s make it happen." : "Choose a time."}</h2>
    {!slot && <><label className="booking-zone" htmlFor="booking-timezone">Times shown in<select id="booking-timezone" value={timeZone} onChange={(e) => { setLoading(true); setError(""); setTimeZone(e.target.value); }} disabled={loading}>
      {[...new Set([timeZone, "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney", "UTC"])].filter(Boolean).map((z) => <option key={z} value={z}>{z.replaceAll("_", " ")}</option>)}
    </select></label>
    {loading ? <p className="booking-loading" role="status">Checking the calendar…</p> : !error && slots.length === 0 ? <div className="booking-empty"><h3>All caught up this week.</h3><p>There are no open times in the next seven days. Check back soon or email me to find a time.</p>{emailLink}</div> : !error && <>
      <div className="booking-days" role="group" aria-label="Available dates">{days.map((day) => {
        const start = slots.find((s) => dateKey(new Date(s.start), timeZone) === day)!.start;
        return <button key={day} type="button" aria-pressed={selectedDate === day} onClick={() => setSelectedDate(day)}><small>{new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone }).format(new Date(start))}</small><strong>{new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone }).format(new Date(start))}</strong><small>{new Intl.DateTimeFormat("en-US", { month: "short", timeZone }).format(new Date(start))}</small></button>;
      })}</div>
      <div className="booking-times" role="group" aria-label="Available times">{slots.filter((s) => dateKey(new Date(s.start), timeZone) === selectedDate).map((s) => <button key={s.start} type="button" onClick={() => { setSlot(s); setError(""); }}>{formatTime(s.start, timeZone)} <span aria-hidden="true">↗</span></button>)}</div>
      <p className="booking-small">Availability is checked again when you confirm.</p>
    </>}</>}
    {slot && <form onSubmit={reserve}>
      <div className="booking-selection"><strong>{formatDate(slot.start, timeZone)}</strong><span>{formatTime(slot.start, timeZone)}–{formatTime(slot.end, timeZone)} · {timeZone.replaceAll("_", " ")}</span><button type="button" onClick={() => { setSlot(null); setLoading(true); payload.current = null; setError(""); }} disabled={submitting || uncertain}>Change time</button></div>
      <fieldset disabled={submitting || uncertain} className="booking-fields"><label>Your name<input name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={254} /></label>
      <label>What would you like to discuss? <small>(optional)</small><textarea name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1500} rows={3} /></label>
      <label className="booking-trap" aria-hidden="true">Website<input name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" /></label></fieldset>
      <p className="booking-small">Your details are shared with Arush and Google to arrange this call. No mailing list. <a href="/book/privacy">Booking privacy</a></p>
      <button type="submit" className="booking-primary" disabled={submitting}>{submitting ? "Confirming your call…" : uncertain ? "Check my booking →" : "Confirm call →"}</button>
    </form>}
    {error && <div className="booking-error" role="alert"><p>{error}</p>{!slot && <button type="button" onClick={() => { setLoading(true); setError(""); setRevision((n) => n + 1); }}>Try again</button>} {emailLink}</div>}
  </>;
}
