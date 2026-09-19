"use client";

import { ArrowUpRight, CalendarDays, ChevronDown, Users, Mail } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import { Button } from "@/components/ui/button";

export function ContactDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size="sm" className="header-button contact-trigger">
          Let&apos;s talk <ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="contact-dropdown" align="end" sideOffset={10} collisionPadding={16}>
          <DropdownMenu.Label className="contact-dropdown-label">Get in touch</DropdownMenu.Label>
          <DropdownMenu.Item asChild>
            <a className="contact-dropdown-item" href="/book">
              <CalendarDays aria-hidden="true" /><span>Book a call<small>30 minutes on Google Meet</small></span><ArrowUpRight aria-hidden="true" />
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <a className="contact-dropdown-item" href="mailto:arushkukrejaa@gmail.com">
              <Mail aria-hidden="true" /><span>Send an email<small>Start a conversation</small></span><ArrowUpRight aria-hidden="true" />
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <a className="contact-dropdown-item" href="https://www.linkedin.com/in/arushkukreja" target="_blank" rel="noopener noreferrer">
              <Users aria-hidden="true" /><span>Connect on LinkedIn<small>Opens in a new tab</small></span><ArrowUpRight aria-hidden="true" />
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
