import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog | BidJobs",
};

export default function BlogPage() {
  return <BlogPageClient />;
}
