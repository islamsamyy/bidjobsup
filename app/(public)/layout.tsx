"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#100d10] text-[#faf1f5] font-body">
      <PublicHeader />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
