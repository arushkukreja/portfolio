"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/scheduling";

export function EmailOptions() {
  const [status, setStatus] = useState("");

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setStatus("Email address copied.");
    } catch {
      setStatus("Select and copy the email address above, then paste it into your email app.");
    }
  }

  return <div className="email-options">
    <p className="email-address">{CONTACT_EMAIL}</p>
    <button className="email-copy" type="button" onClick={copyAddress}>Copy email address</button>
    <p className="email-copy-status" role="status">{status}</p>
    <div className="email-provider-options">
      <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}`} target="_blank" rel="noopener noreferrer">
        <strong>Open Gmail ↗</strong><span>Compose in a new browser tab.</span>
      </a>
      <a href={`mailto:${CONTACT_EMAIL}`}>
        <strong>Open my email app ↗</strong><span>Use the email app set up on your device.</span>
      </a>
    </div>
    <p className="booking-small">Use any email provider. If an option doesn’t open, copy the address and start a new message in your inbox.</p>
  </div>;
}
