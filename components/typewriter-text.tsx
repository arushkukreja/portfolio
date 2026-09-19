"use client";

import { useEffect, useState } from "react";

export function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [visibleText, setVisibleText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => {
        setVisibleText(text);
        setIsComplete(true);
      });

      return () => window.cancelAnimationFrame(frame);
    }

    let character = 0;
    const timer = window.setInterval(() => {
      character = Math.min(character + 2, text.length);
      setVisibleText(text.slice(0, character));

      if (character === text.length) {
        window.clearInterval(timer);
        setIsComplete(true);
      }
    }, 24);

    return () => window.clearInterval(timer);
  }, [text]);

  return (
    <p className={`${className ?? ""} typewriter-text`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{visibleText}</span>
      <span className={isComplete ? "typewriter-cursor typewriter-cursor-idle" : "typewriter-cursor"} aria-hidden="true" />
    </p>
  );
}
