import type { Metadata } from "next";
import { HomeLink } from "@/components/home-link";
import { LegalLinks } from "@/components/legal-links";
import { EmailOptions } from "@/components/email-options";
import "../book/booking.css";
import "./contact.css";

export const metadata: Metadata = {
  title: "Get in touch — Arush Kukreja",
  description: "Email Arush Kukreja about strategy, product, applied AI, or an opportunity to work together.",
};

export default function ContactPage() {
  return <main className="booking-page contact-page">
    <header className="booking-header"><HomeLink className="monogram" aria-label="Arush Kukreja, home">AK<span>.</span></HomeLink><HomeLink>← Back to portfolio</HomeLink></header>
    <section className="contact-email-content" aria-labelledby="contact-title">
      <p className="booking-eyebrow">LET’S CONNECT</p>
      <h1 id="contact-title">Start a conversation.</h1>
      <p className="contact-email-intro">Have an idea, a question, or an opportunity in mind? Send me a note.</p>
      <div className="booking-card contact-email-card"><EmailOptions /></div>
      <p className="contact-other-option">Rather talk it through? <a href="/book">Book a 30-minute call →</a></p>
    </section>
    <footer className="booking-footer"><span>Strategy, product, and AI.</span><LegalLinks /></footer>
  </main>;
}
