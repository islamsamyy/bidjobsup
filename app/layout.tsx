import type { Metadata } from "next";
import { Noto_Serif, Plus_Jakarta_Sans, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "./providers/LanguageProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import "./globals.css";
import { cn } from "@/lib/utils";

// Theme is handled by ThemeProvider useEffect
// Language is handled by LanguageProvider useEffect
// Don't set these in inline script to avoid hydration mismatch

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const notoSerif = Noto_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BidJobs — Where Elite Talent Meets Opportunity",
  description:
    "A premium job marketplace connecting employers with world-class freelancers. Post jobs, submit bids, and build your professional reputation.",
  keywords: ["jobs", "freelance", "bidding", "marketplace", "talent", "hiring"],
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={cn("h-full", notoSerif.variable, plusJakarta.variable, "font-sans", geist.variable)}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col antialiased bg-background text-on-surface">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
