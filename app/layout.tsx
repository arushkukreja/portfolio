import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const title = "Arush Kukreja — Fraud Analytics, Product & Applied AI";
  const description =
    "Portfolio of Arush Kukreja, a fraud strategist and product builder connecting fraud analytics, product systems, and applied AI automation.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: origin,
      images: [{ url: `${origin}/og.png`, width: 1731, height: 909, alt: "Arush Kukreja — Fraud analytics, product, and applied AI." }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("dark font-sans", geist.variable)}>
      <head>
        <link rel="icon" type="image/png" sizes="120x120" href="/favicon.png?v=2" />
        <link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg?v=2" />
        <meta name="google-site-verification" content="wFoNOMwioYoqw4JbzKGmoieHNwbw43CCX0YQj0zq2gc" />
      </head>
      <body>{children}</body>
    </html>
  );
}
