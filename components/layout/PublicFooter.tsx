"use client";

import Link from "next/link";

export default function PublicFooter() {
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Find Jobs", href: "/jobs/browse" },
        { name: "Find Talent", href: "/talent" },
        { name: "CV Optimizer", href: "/ats-optimize" },
        { name: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Vision 2030", href: "/vision-2030" },
        { name: "Contact Support", href: "/contact" },
        { name: "Join", href: "/join" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/terms" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-[#100d10] border-t border-[#292428]/30 pt-24 pb-12">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Info */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo.png" alt="BidJobs Logo" className="h-10 w-auto" />
            </div>
            <p className="text-[#b0a9ad] text-sm leading-relaxed mb-8 max-w-xs">
              Empowering the Kingdom's most elite talent to build the future of Vision 2030. Connect with premier organizations and lead the digital renaissance.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: "language", href: "/about", label: "About BidJobs" },
                { icon: "public", href: "/vision-2030", label: "Vision 2030" },
                { icon: "hub", href: "/community", label: "Community" },
              ].map(({ icon, href, label }) => (
                <Link
                  key={icon}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-[#1c181c] flex items-center justify-center hover:bg-[#caa2f7]/20 hover:text-[#caa2f7] transition-colors text-[#b0a9ad]"
                >
                  <span className="material-symbols-outlined text-xl">{icon}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sitemaps */}
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-8">
              <h4 className="text-[#caa2f7] font-headline font-bold text-sm uppercase tracking-widest">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[#b0a9ad] hover:text-[#caa2f7] transition-colors text-xs font-medium uppercase tracking-wider"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[#292428]/20 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[#b0a9ad]/40 text-[0.7rem] font-medium tracking-wide">
            © 2026 BidJobs. Built for Saudi Vision 2030. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-[#151215] border border-[#caa2f7]/15 text-[10px] font-bold tracking-widest text-[#caa2f7] rounded uppercase">
              Vision 2030 Verified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
