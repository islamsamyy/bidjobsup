"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LanguageSwitcher } from "@/components/features/LanguageSwitcher";
import NotificationBell from "@/components/features/NotificationBell";

/* ─────────────────────────────────────────────────────────────────
   NAV STRUCTURE
───────────────────────────────────────────────────────────────── */
const NAV = [
  {
    label: "Hire Talent",
    icon: "person_search",
    items: [
      { label: "Find Talent",    href: "/talent",           icon: "person_search", desc: "Browse our elite specialist directory" },
      { label: "Post Mandate",   href: "/join",             icon: "stars",         desc: "Join as an employer" },
      { label: "Arabic Version", href: "/home-ar",          icon: "translate",     desc: "النسخة العربية" },
    ],
  },
  {
    label: "Find Work",
    icon: "work",
    items: [
      { label: "Browse Jobs",    href: "/jobs/browse",  icon: "grid_view",     desc: "Explore all open roles" },
      { label: "Job Listings",   href: "/jobs/list",    icon: "view_list",     desc: "Full job catalogue with filters" },
      { label: "Search Jobs",    href: "/jobs/search",  icon: "search",        desc: "Find by keyword or skill" },
    ],
  },
  {
    label: "Community",
    icon: "groups",
    items: [
      { label: "Editorial Blog", href: "/blog",           icon: "article",       desc: "Strategy, insights & market intel" },
      { label: "Community Hub",  href: "/community",      icon: "forum",         desc: "Our mission & network values" },
      { label: "Vision 2030",    href: "/vision-2030",    icon: "flag",          desc: "Saudi national alignment" },
    ],
  },
  {
    label: "Company",
    icon: "corporate_fare",
    items: [
      { label: "About Us",       href: "/about",          icon: "info",          desc: "Our mission & team" },
      { label: "Pricing",        href: "/pricing",        icon: "payments",      desc: "Plans for every level" },
      { label: "Contact",        href: "/contact",        icon: "mail",          desc: "Get in touch with us" },
      { label: "Terms & Privacy",href: "/terms",          icon: "policy",        desc: "Legal & privacy docs" },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────── */
export default function PublicHeader({
  initialUser,
  initialProfile,
}: {
  initialUser?: any;
  initialProfile?: any;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(initialUser ?? null);
  const [profile, setProfile] = useState<any>(initialProfile ?? null);
  const [loading, setLoading] = useState(!initialUser);

  // Which desktop dropdown is open
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const supabase = createClient();

  /* auth ────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!initialUser) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
        if (user) {
          supabase.from("users").select("*").eq("auth_id", user.id).single()
            .then(({ data }) => setProfile(data));
        }
        setLoading(false);
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          const { data } = await supabase.from("users").select("*").eq("auth_id", session.user.id).single();
          setProfile(data);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initialUser, supabase]);

  // Close mobile drawer on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reset UI on navigation
  useEffect(() => { setMobileOpen(false); setOpenMenu(null); }, [pathname]);

  /* dropdown helpers ────────────────────────────────────────── */
  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  /* ─────────────────────────────────────────────────────────── */
  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#100d10]/80 backdrop-blur-2xl border-b border-[#292428]/40">
        <div className="flex justify-between items-center w-full px-5 md:px-10 xl:px-14 py-3.5 max-w-screen-2xl mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <img src="/logo.png" alt="BidJobs" className="h-9 w-auto group-hover:opacity-80 transition-opacity" />
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden xl:flex items-center gap-1">
            {NAV.map((group) => {
              const isActive = group.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/"));
              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(group.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Trigger */}
                  <button
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black tracking-[0.18em] uppercase transition-all duration-200
                      ${isActive
                        ? "text-primary bg-primary/10"
                        : "text-[#b0a9ad] hover:text-[#faf1f5] hover:bg-white/5"
                      }`}
                  >
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                      {group.icon}
                    </span>
                    {group.label}
                    <span
                      className={`material-symbols-outlined text-[13px] transition-transform duration-200 ${openMenu === group.label ? "rotate-180" : ""}`}
                    >
                      keyboard_arrow_down
                    </span>
                  </button>

                  {/* Dropdown panel */}
                  {openMenu === group.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-[#1c181c]/95 backdrop-blur-xl border border-[#292428]/60 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="p-2 space-y-0.5">
                        {group.items.map((item) => {
                          const active = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-all group/item
                                ${active
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-white/5 text-[#b0a9ad] hover:text-[#faf1f5]"
                                }`}
                            >
                              <span
                                className={`material-symbols-outlined text-[18px] mt-0.5 shrink-0 transition-colors
                                  ${active ? "text-primary" : "text-[#4b474a] group-hover/item:text-primary"}`}
                                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                              >
                                {item.icon}
                              </span>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">{item.label}</p>
                                <p className="text-[10px] text-[#585457] mt-1 leading-snug font-medium">{item.desc}</p>
                              </div>
                              {active && (
                                <span className="material-symbols-outlined text-[14px] text-primary ml-auto mt-0.5">check_circle</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Standalone Pricing quick-link */}
            <Link
              href="/pricing"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black tracking-[0.18em] uppercase transition-all duration-200
                ${pathname === "/pricing"
                  ? "text-primary bg-primary/10"
                  : "text-[#b0a9ad] hover:text-[#faf1f5] hover:bg-white/5"
                }`}
            >
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: pathname === "/pricing" ? "'FILL' 1" : "'FILL' 0" }}>
                payments
              </span>
              Pricing
            </Link>
          </div>

          {/* ── Auth + mobile toggle ── */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {loading ? (
              <div className="w-28 h-9 bg-surface-container-highest animate-pulse rounded-full" />
            ) : user ? (
              <div className="hidden xl:flex items-center gap-3">
                {profile && (
                  <NotificationBell userId={profile.id} userAuthId={user.id} userType={profile.user_type} />
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-gradient-to-br from-[#caa2f7] to-[#b690e3] text-[#431f6b] font-black py-2 px-5 rounded-full shadow-[0_8px_20px_rgba(202,162,247,0.2)] hover:scale-[0.98] hover:shadow-none transition-all text-[10px] tracking-[0.18em] uppercase"
                >
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                  Dashboard
                </Link>
                <Link
                  href="/dashboard"
                  className="w-9 h-9 rounded-full border border-[#292428] overflow-hidden bg-surface-container flex items-center justify-center hover:border-primary/50 transition-colors shrink-0"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-secondary font-black text-base uppercase">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "?"}
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <div className="hidden xl:flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="text-[10px] font-black tracking-[0.18em] uppercase text-[#b0a9ad] hover:text-[#faf1f5] transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/join"
                  className="bg-gradient-to-br from-[#caa2f7] to-[#b690e3] text-[#431f6b] font-black py-2.5 px-6 rounded-xl shadow-[0_8px_20px_rgba(202,162,247,0.2)] hover:scale-[0.98] hover:shadow-none transition-all text-[10px] tracking-[0.18em] uppercase whitespace-nowrap"
                >
                  Join Elite
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="xl:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-xl bg-surface-container border border-outline-variant/20 hover:bg-surface-container-high transition-colors"
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-0.5 bg-on-surface transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-5 h-0.5 bg-on-surface transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`w-5 h-0.5 bg-on-surface transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 xl:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-[#1c181c] border-l border-[#292428]/60 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#292428]/40">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <img src="/logo.png" alt="BidJobs" className="h-8 w-auto" />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Drawer nav */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
              {NAV.map((group) => {
                const isExpanded = mobileExpanded === group.label;
                const isActive = group.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/"));

                return (
                  <div key={group.label} className="rounded-2xl overflow-hidden">
                    {/* Group header */}
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : group.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors rounded-2xl
                        ${isActive ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-[#b0a9ad]"}`}
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${isActive ? "text-primary" : "text-[#4b474a]"}`}
                        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {group.icon}
                      </span>
                      <span className="text-[10px] font-black tracking-[0.18em] uppercase flex-1">{group.label}</span>
                      <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                        keyboard_arrow_down
                      </span>
                    </button>

                    {/* Group items */}
                    {isExpanded && (
                      <div className="mt-1 ml-4 space-y-0.5 border-l border-primary/20 pl-4">
                        {group.items.map((item) => {
                          const active = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors
                                ${active ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-[#b0a9ad] hover:text-[#faf1f5]"}`}
                            >
                              <span
                                className={`material-symbols-outlined text-[16px] shrink-0 ${active ? "text-primary" : "text-[#4b474a]"}`}
                                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                              >
                                {item.icon}
                              </span>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.15em]">{item.label}</p>
                                <p className="text-[10px] text-[#585457] font-medium mt-0.5 leading-snug">{item.desc}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Pricing standalone */}
              <Link
                href="/pricing"
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors
                  ${pathname === "/pricing" ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-[#b0a9ad]"}`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${pathname === "/pricing" ? "text-primary" : "text-[#4b474a]"}`}
                  style={{ fontVariationSettings: pathname === "/pricing" ? "'FILL' 1" : "'FILL' 0" }}
                >
                  payments
                </span>
                <span className="text-[10px] font-black tracking-[0.18em] uppercase">Pricing</span>
              </Link>
            </div>

            {/* Drawer auth footer */}
            <div className="px-4 py-6 border-t border-[#292428]/40 space-y-3">
              {loading ? (
                <div className="w-full h-12 bg-surface-container-highest animate-pulse rounded-xl" />
              ) : user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 w-full bg-gradient-to-br from-[#caa2f7] to-[#b690e3] text-[#431f6b] font-black py-3.5 px-5 rounded-xl text-[10px] tracking-[0.18em] uppercase"
                  >
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                    Go to Dashboard
                  </Link>
                  <div className="flex items-center gap-3 px-1">
                    <div className="w-9 h-9 rounded-full border border-[#292428] overflow-hidden bg-surface-container flex items-center justify-center shrink-0">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-secondary font-black text-sm uppercase">
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate">{profile?.full_name || "My Account"}</p>
                      <p className="text-[10px] text-[#585457] truncate">{user.email}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/join"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-br from-[#caa2f7] to-[#b690e3] text-[#431f6b] font-black py-3.5 px-5 rounded-xl text-[10px] tracking-[0.18em] uppercase"
                  >
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                    Join Elite
                  </Link>
                  <Link
                    href="/sign-in"
                    className="flex items-center justify-center w-full border border-[#292428]/60 text-[#b0a9ad] hover:text-[#faf1f5] font-black py-3.5 px-5 rounded-xl text-[10px] tracking-[0.18em] uppercase transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
