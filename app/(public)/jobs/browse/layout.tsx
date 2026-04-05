import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Jobs — Find Your Next Mission | BidJobs",
  description:
    "Explore thousands of elite roles across design, engineering, product, and more. Filter by category, location, and budget to find your perfect match.",
  openGraph: {
    title: "Browse Jobs — Find Your Next Mission | BidJobs",
    description: "Explore thousands of elite roles. Filter by category, location, and budget.",
    type: "website",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/browse`,
  },
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
