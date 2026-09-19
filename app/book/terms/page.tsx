import type { Metadata } from "next";
import Link from "next/link";
import { LegalLinks } from "@/components/legal-links";
import "../booking.css";

export const metadata: Metadata = {
  title: "Terms of service — Arush Kukreja",
  description: "Terms for using Arush Kukreja’s portfolio and booking an introductory call.",
};

export default function TermsPage() {
  return (
    <main className="booking-page">
      <article className="booking-privacy">
        <Link href="/">← Back to portfolio</Link>
        <h1>Terms of service</h1>
        <p className="legal-date">Effective September 19, 2026</p>
        <p>These terms apply to arushkukreja.com, the personal portfolio and call-booking service operated by Arush Kukreja. By submitting a booking, you agree to these terms. If you do not agree, please do not submit a booking. You can contact Arush by email instead.</p>

        <h2>1. The website and booking service</h2>
        <p>This website shares Arush’s experience, projects, and work. The booking service lets you arrange a free, 30-minute introductory conversation about opportunities, projects, or shared interests. It uses Google Calendar and Google Meet to check availability, create meetings, and provide meeting links.</p>
        <p>Available times are shown on the booking page and may change. Check the displayed date, time, and timezone before confirming. A booking is confirmed when the website displays a successful confirmation or you receive a calendar invitation. If the result is unclear, contact Arush before making another booking.</p>

        <h2>2. Your booking details</h2>
        <p>Provide your own name and an email address you can access, and make bookings only for a genuine conversation. You are responsible for the accuracy of the information you submit. Do not include passwords, financial account details, confidential employer or client information, or other sensitive information in the booking message.</p>
        <p>You do not need to connect your Google account or give this website access to your calendar to book a call. Only the organizer connects a calendar. Your booking information is handled as described in the <a href="/book/privacy">Privacy policy</a>.</p>

        <h2>3. Cancellations and rescheduling</h2>
        <p>To cancel or request a different time, email <a href="mailto:arushkukrejaa@gmail.com">arushkukrejaa@gmail.com</a>, preferably before the scheduled call. There is no cancellation fee. A new time is subject to availability and confirmation.</p>
        <p>Arush may need to decline, cancel, or reschedule a meeting, including because of a scheduling conflict or misuse of the service. When possible, you will be notified using your booking email address or calendar invitation.</p>

        <h2>4. Acceptable use</h2>
        <p>Do not use the website to send spam, impersonate someone, make fraudulent or excessive bookings, harass others, interfere with the service, bypass booking limits, or attempt unauthorized access. Bookings or access may be restricted to address misuse or protect the service.</p>

        <h2>5. Introductory conversations</h2>
        <p>Website content and introductory calls are for general information and discussion. They are not personalized legal, financial, investment, or other regulated professional advice. A booking does not create an employment, consulting, client, or fiduciary relationship, or commit either party to future work. Any paid engagement or confidentiality agreement must be agreed separately.</p>

        <h2>6. Content and third-party services</h2>
        <p>Portfolio content belongs to Arush or its respective owners. You may view it and share links to it. These terms do not grant permission to claim the work as your own or use third-party trademarks, images, or materials beyond what their owners or applicable law permit.</p>
        <p>Google Calendar, Google Meet, LinkedIn, and other linked services are operated independently and have their own terms and privacy policies. Their availability, invitation delivery, and features are outside Arush’s control.</p>

        <h2>7. Availability and responsibility</h2>
        <p>The website and free booking service are provided as available. Reasonable care is taken, but uninterrupted access, error-free scheduling, and delivery of every invitation cannot be guaranteed. If something goes wrong, contact Arush to confirm the meeting details.</p>
        <p>To the extent permitted by applicable law, Arush is not responsible for indirect or consequential losses resulting from use of this free service. Nothing in these terms excludes liability that cannot lawfully be excluded or limits any mandatory rights you have under applicable law.</p>

        <h2>8. Changes and contact</h2>
        <p>These terms may be updated as the website or service changes. Updates will be published here with a revised effective date and apply to bookings made after that date.</p>
        <p>For questions about these terms or a booking, email <a href="mailto:arushkukrejaa@gmail.com">arushkukrejaa@gmail.com</a>.</p>
      </article>
      <footer className="booking-footer"><Link href="/">Arush Kukreja</Link><LegalLinks /></footer>
    </main>
  );
}
