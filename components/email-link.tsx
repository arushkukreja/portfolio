import type { ComponentPropsWithoutRef } from "react";

export function EmailLink({ children, ...props }: Omit<ComponentPropsWithoutRef<"a">, "href">) {
  // Use native navigation, as the vinext client router fails on this deployment.
  return <a href="/contact" {...props}>{children}</a>;
}
