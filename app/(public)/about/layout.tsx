import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BidJobs — Our Mission & Vision",
  description:
    "Learn how BidJobs is reshaping the talent economy. A premium platform built for ambitious professionals and forward-thinking companies.",
  openGraph: {
    title: "About BidJobs — Our Mission & Vision",
    description: "Learn how BidJobs is reshaping the talent economy.",
    type: "website",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
