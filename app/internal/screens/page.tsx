"use client";

import Link from "next/link";

const sections = [
  {
    title: "Public Pages",
    icon: "🌐",
    links: [
      { title: "Homepage (Pixel Perfect)", route: "(public)/home" },
      { title: "Homepage (Arabic)", route: "(public)/home-ar" },
      { title: "About Us", route: "(public)/about" },
      { title: "Contact Support", route: "(public)/contact" },
      { title: "Pricing & Plans", route: "(public)/pricing" },
      { title: "Terms & Privacy", route: "(public)/terms" },
      { title: "404 Page", route: "(public)/404" },
    ],
  },
  {
    title: "Authentication",
    icon: "🔐",
    links: [
      { title: "Sign In", route: "(auth)/sign-in" },
      { title: "Create Profile", route: "(auth)/create-profile" },
      { title: "Forgot Password", route: "(auth)/forgot-password" },
      { title: "Reset Password", route: "(auth)/reset-password" },
      { title: "Join the Elite", route: "(auth)/join" },
    ],
  },
  {
    title: "Jobs",
    icon: "💼",
    links: [
      { title: "Browse Jobs", route: "jobs/browse" },
      { title: "Job List", route: "jobs/list" },
      { title: "Job Details", route: "jobs/details" },
      { title: "Search Results", route: "jobs/search" },
      { title: "No Results Found", route: "jobs/no-results" },
    ],
  },
  {
    title: "Community",
    icon: "💬",
    links: [
      { title: "Community Feed", route: "community/feed" },
      { title: "Blog Index", route: "community/blog" },
      { title: "Single Article", route: "community/article" },
    ],
  },
  {
    title: "Seeker Dashboard",
    icon: "👤",
    links: [
      { title: "Dashboard Overview", route: "dashboard/seeker" },
      { title: "My Profile", route: "dashboard/seeker/profile" },
      { title: "My Applications", route: "dashboard/seeker/applications" },
      { title: "Saved & Notifications", route: "dashboard/seeker/saved" },
      { title: "Subscription Plans", route: "dashboard/seeker/subscription" },
    ],
  },
  {
    title: "Employer Dashboard",
    icon: "🏢",
    links: [
      { title: "Dashboard Overview", route: "dashboard/employer" },
      { title: "Manage Listings", route: "dashboard/employer/listings" },
      { title: "Post a New Role", route: "dashboard/employer/post-job" },
      { title: "Company Profile Editor", route: "dashboard/employer/profile" },
      { title: "Talent Pipeline", route: "dashboard/employer/talent" },
      { title: "Billing & Plans", route: "dashboard/employer/billing" },
    ],
  },
  {
    title: "Messaging",
    icon: "✉️",
    links: [{ title: "Messages", route: "messages" }],
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen p-8 md:p-12"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="mb-12 animate-fade-in">
          <h1
            className="font-heading text-display-lg mb-3"
            style={{ color: "var(--primary)" }}
          >
            BidJobs
          </h1>
          <p className="text-body-md" style={{ color: "var(--on-surface-variant)" }}>
            Neon Nocturne Design System — All {sections.reduce((a, s) => a + s.links.length, 0)} screens from Stitch
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="card-surface p-6"
              style={{ background: "var(--surface-container)" }}
            >
              <h2
                className="text-headline-md mb-4 flex items-center gap-2"
                style={{ color: "var(--on-surface)", fontSize: "1.125rem" }}
              >
                <span>{section.icon}</span>
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.route}>
                    <Link
                      href={`/${link.route}`}
                      className="block py-1.5 px-3 rounded-lg text-sm transition-colors duration-200"
                      style={{
                        color: "var(--secondary)",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background =
                          "var(--surface-container-highest)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background = "transparent";
                      }}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="mt-12 pt-8 text-center text-label-md"
          style={{
            borderTop: "1px solid var(--border)",
            color: "var(--on-surface-variant)",
          }}
        >
          BidJobs © 2026 · Islam Samy · Neon Nocturne Design System
        </div>
      </div>
    </div>
  );
}