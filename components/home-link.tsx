import type { ComponentPropsWithoutRef } from "react";

export function HomeLink({ children, ...props }: Omit<ComponentPropsWithoutRef<"a">, "href">) {
  // Native navigation avoids the broken vinext client-router transition on Vercel.
  // eslint-disable-next-line @next/next/no-html-link-for-pages
  return <a href="/" {...props}>{children}</a>;
}
