"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PublicHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from('users').select('*').eq('auth_id', user.id).single();
        setProfile(data);
      }
      setLoading(false);
    };

    fetchUserAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
         const { data } = await supabase.from('users').select('*').eq('auth_id', session.user.id).single();
         setProfile(data);
      } else {
         setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: "Find Jobs", href: "/jobs/browse" },
    { name: "Companies", href: "/jobs/list" },
    { name: "Vision 2030", href: "/vision-2030" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#100d10]/70 backdrop-blur-xl border-b border-[#292428]/30">
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-4 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="BidJobs Logo" className="h-10 w-auto group-hover:opacity-90 transition-opacity duration-300" />
        </Link>

        {/* Navigation Links */}
        <div className="hidden xl:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 hover:text-[#caa2f7] relative group ${
                pathname === link.href ? "text-[#caa2f7]" : "text-[#b0a9ad]"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#caa2f7] transition-transform duration-300 origin-left ${
                pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {loading ? (
            <div className="w-32 h-10 bg-surface-container-highest animate-pulse rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="bg-gradient-to-br from-[#caa2f7] to-[#b690e3] text-[#431f6b] font-black py-2 px-6 rounded-full shadow-[0_8px_20px_rgba(202,162,247,0.2)] hover:scale-[0.98] hover:shadow-none transition-all duration-200 text-[10px] tracking-[0.2em] uppercase whitespace-nowrap flex items-center gap-2 group"
              >
                Dashboard
              </Link>
              <Link href="/dashboard" className="w-10 h-10 rounded-full border border-[#292428] overflow-hidden bg-surface-container justify-center items-center flex hover:border-primary/50 transition-colors">
                 {profile?.avatar_url ? (
                   <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-secondary font-bold text-lg font-headline uppercase">
                     {profile?.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                   </span>
                 )}
              </Link>
            </div>
          ) : (
            <>
              <Link 
                href="/sign-in" 
                className="text-[10px] font-black tracking-[0.2em] uppercase text-[#faf1f5] hover:text-[#caa2f7] transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/join"
                className="bg-gradient-to-br from-[#caa2f7] to-[#b690e3] text-[#431f6b] font-black py-3 px-8 rounded-xl shadow-[0_8px_20px_rgba(202,162,247,0.2)] hover:scale-[0.98] hover:shadow-none transition-all duration-200 text-[10px] tracking-[0.2em] uppercase whitespace-nowrap"
              >
                Join Elite
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
