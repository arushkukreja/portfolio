import type { Metadata } from "next";
import { LegalLinks } from "@/components/legal-links";
import Link from "next/link";
import { BookingForm } from "../../components/booking-form";
import "./booking.css";

export const metadata: Metadata = { title: "Book a call — Arush Kukreja", description: "Find a time for a 30-minute conversation with Arush about strategy, product, or applied AI." };

export default function BookPage() {
  return <main className="booking-page">
    <header className="booking-header"><Link className="monogram" href="/" aria-label="Arush Kukreja, home">AK<span>.</span></Link><Link href="/">← Back to portfolio</Link></header>
    <div className="booking-layout">
      <aside className="booking-intro">
        <p className="booking-eyebrow">LET’S CONNECT</p>
        <h1>A good conversation<br />starts here<span>.</span></h1>
        <p>Have an idea, a hard problem, or an opportunity in mind? Let’s find a time to talk.</p>
        <dl className="booking-facts"><div><dt>WITH</dt><dd>Arush Kukreja</dd></div><div><dt>DURATION</dt><dd>30 minutes</dd></div><div><dt>LOCATION</dt><dd>Google Meet</dd></div><div><dt>AVAILABILITY</dt><dd>Every day · next 7 days<br /><small>10 a.m.–2 p.m. Eastern Time</small></dd></div></dl>
        <p className="booking-aside-note">Pick a time, share a little context, and I’ll see you there.</p>
      </aside>
      <section className="booking-card" aria-label="Book a call"><BookingForm /></section>
    </div>
    <footer className="booking-footer"><span>Strategy, product, and AI.</span><LegalLinks /><a href="mailto:arushkukrejaa@gmail.com">Prefer email? Get in touch ↗</a></footer>
  </main>;
}
