import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const origin = "https://www.arushkukreja.com";
const title = "Arush Kukreja — Fraud Analytics, Product & Applied AI";
const description =
  "Portfolio of Arush Kukreja, a fraud strategist and product builder connecting fraud analytics, product systems, and applied AI automation.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: origin,
    images: [{ url: `${origin}/og-portfolio.png`, width: 1730, height: 909, alt: "Arush Kukreja — I build at the intersection of strategy, product, and AI. Cream paper, typewriter lettering, and burgundy accents matching the portfolio." }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${origin}/og-portfolio.png`],
  },
};

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
