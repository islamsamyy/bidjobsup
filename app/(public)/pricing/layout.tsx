import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — BidJobs Protocol Plans",
  description:
    "Choose the plan that matches your ambition. From emerging talent to enterprise teams — BidJobs has a protocol for every level.",
  openGraph: {
    title: "Pricing — BidJobs Protocol Plans",
    description: "Choose the plan that matches your ambition.",
    type: "website",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
