"use client";

import Link from "next/link";

export default function TermsPage() {
  const sections = [
    { id: "introduction", title: "Introduction", num: "01" },
    { id: "user-conduct", title: "User Conduct", num: "02" },
    { id: "data-privacy", title: "Data Privacy", num: "03" },
    { id: "liability", title: "Liability & Indemnity", num: "04" },
    { id: "intellectual-property", title: "Intellectual Property", num: "05" },
    { id: "payment-terms", title: "Payment & Escrow", num: "06" },
  ];

  return (
    <main className="pt-32 pb-40 px-8 max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-20">
      {/* Sidebar Navigation */}
      <aside className="lg:w-1/4 shrink-0">
        <div className="sticky top-32 space-y-12">
          <div className="space-y-6">
            <h3 className="font-headline text-xl text-[#caa2f7] border-l-2 border-[#caa2f7] pl-6 uppercase tracking-widest font-black">Legal Directory</h3>
            <nav className="flex flex-col gap-2">
              {sections.map((section) => (
                <a 
                  key={section.id}
                  href={`#${section.id}`} 
                  className="px-6 py-4 rounded-2xl hover:bg-[#1c181c] text-[#b0a9ad] hover:text-[#faf1f5] transition-all duration-300 font-medium border border-transparent hover:border-[#292428] text-sm"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
          
          <div className="p-8 rounded-[2rem] bg-[#1c181c] border border-[#292428] space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#b0a9ad]/50">Last Updated</p>
              <p className="font-headline italic text-[#faf1f5] text-lg">October 24, 2030</p>
            </div>
            <button className="w-full py-4 bg-[#292428] border border-[#4b474a] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#322c31] transition-colors text-[#faf1f5]">
              Download PDF Bundle
            </button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="lg:w-3/4 space-y-32">
        {/* Hero Header */}
        <header className="space-y-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-black tracking-[0.2em] uppercase">
            Platform Governance
          </span>
          <h1 className="font-headline text-6xl md:text-8xl font-black text-[#faf1f5] leading-[0.9] tracking-tighter uppercase">
            The Legal <br/>
            <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_20px_rgba(202,162,247,0.3)]">Framework</span>
          </h1>
          <p className="text-xl text-[#b0a9ad] max-w-2xl font-light leading-relaxed">
            Transparent, equitable, and forward-looking. Our terms govern the intersection of elite talent and premium opportunities within the BidJobs ecosystem.
          </p>
        </header>

        {/* Content Sections */}
        <div className="space-y-40">
          {/* Introduction */}
          <section id="introduction" className="scroll-mt-32 space-y-12 group/sec">
            <div className="flex items-center gap-6">
              <span className="font-headline text-5xl text-[#caa2f7]/20 font-black group-hover/sec:text-[#caa2f7]/40 transition-colors">01</span>
              <h2 className="font-headline text-4xl font-black text-[#faf1f5] uppercase tracking-tight">Introduction</h2>
            </div>
            <div className="prose prose-invert max-w-none text-[#b0a9ad] leading-loose space-y-8 text-lg font-light">
              <p>Welcome to BidJobs. These Terms of Service ("Terms") constitute a legally binding agreement between you and BidJobs regarding your use of our platform, services, and associated applications.</p>
              <p>By accessing or using BidJobs, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must immediately cease all use of our services.</p>
              <blockquote className="p-10 bg-[#1c181c] rounded-[2.5rem] border-l-4 border-[#caa2f7] shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <p className="italic text-[#faf1f5] text-xl font-light leading-relaxed">"Our mission is to provide a sanctuary for creative and technical excellence. These rules ensure that the sanctuary remains pristine."</p>
              </blockquote>
            </div>
          </section>

          {/* User Conduct */}
          <section id="user-conduct" className="scroll-mt-32 space-y-12 group/sec">
            <div className="flex items-center gap-6">
              <span className="font-headline text-5xl text-[#caa2f7]/20 font-black group-hover/sec:text-[#caa2f7]/40 transition-colors">02</span>
              <h2 className="font-headline text-4xl font-black text-[#faf1f5] uppercase tracking-tight">User Conduct</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-12 rounded-[2.5rem] bg-[#1c181c] border border-[#292428] hover:border-[#caa2f7]/30 transition-all duration-500 group">
                <span className="material-symbols-outlined text-[#caa2f7] text-4xl mb-8">verified_user</span>
                <h4 className="font-headline text-2xl font-black text-[#faf1f5] mb-4 uppercase tracking-tight">Authenticity</h4>
                <p className="text-[#b0a9ad] text-sm leading-relaxed font-light">All profile information, portfolios, and job briefs must represent factual truth. Impersonation or fabrication of credentials results in immediate termination.</p>
              </div>
              <div className="p-12 rounded-[2.5rem] bg-[#1c181c] border border-[#292428] hover:border-[#caa2f7]/30 transition-all duration-500 group">
                <span className="material-symbols-outlined text-[#caa2f7] text-4xl mb-8">gavel</span>
                <h4 className="font-headline text-2xl font-black text-[#faf1f5] mb-4 uppercase tracking-tight">Professionalism</h4>
                <p className="text-[#b0a9ad] text-sm leading-relaxed font-light">Communication must remain respectful and architectural. Harassment, discrimination, or predatory bidding behaviors are strictly prohibited.</p>
              </div>
            </div>
          </section>

          {/* Data Privacy */}
          <section id="data-privacy" className="scroll-mt-32 space-y-12 group/sec">
            <div className="flex items-center gap-6">
              <span className="font-headline text-5xl text-[#caa2f7]/20 font-black group-hover/sec:text-[#caa2f7]/40 transition-colors">03</span>
              <h2 className="font-headline text-4xl font-black text-[#faf1f5] uppercase tracking-tight">Data Privacy</h2>
            </div>
            <div className="space-y-8 text-[#b0a9ad] font-light leading-loose text-lg">
              <p>Your data is treated with the same reverence as a masterwork. We utilize end-to-end encryption for all brief communications and personal identifying information (PII).</p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: "Collection", text: "We collect only what is necessary to facilitate high-end talent matching." },
                  { label: "Usage", text: "AI-driven matching uses anonymized patterns, never your identity for third-party sales." },
                  { label: "Retention", text: "Upon account deletion, all non-transactional data is purged within 30 days." }
                ].map((item) => (
                  <div key={item.label} className="p-8 rounded-2xl bg-[#1c181c]/50 border border-[#292428] flex gap-6 items-start">
                    <span className="text-[#caa2f7] font-black text-2xl leading-none">/</span>
                    <p><strong className="text-[#faf1f5] font-black uppercase tracking-widest text-xs mr-4">{item.label}:</strong> {item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Liability */}
          <section id="liability" className="scroll-mt-32 space-y-12 group/sec">
            <div className="flex items-center gap-6">
              <span className="font-headline text-5xl text-[#caa2f7]/20 font-black group-hover/sec:text-[#caa2f7]/40 transition-colors">04</span>
              <h2 className="font-headline text-4xl font-black text-[#faf1f5] uppercase tracking-tight">Liability</h2>
            </div>
            <div className="p-16 bg-[#151215] rounded-[2.5rem] border border-[#292428] space-y-10 shadow-[inner_0_0_40px_rgba(0,0,0,0.4)]">
              <p className="text-[#faf1f5] italic text-xl font-light leading-relaxed">BidJobs acts as a facilitator, not an employer or agent. We provide the infrastructure for excellence but do not guarantee the performance of either party involved in a brief.</p>
              <div className="space-y-4 pt-10 border-t border-[#292428]">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b0a9ad]">Limitation of Liability:</p>
                <p className="text-[#b0a9ad] text-xs leading-loose uppercase tracking-widest font-bold">
                  IN NO EVENT SHALL BIDJOBS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Contact Support Section */}
        <section className="p-16 rounded-[3rem] bg-gradient-to-br from-[#1c181c] to-[#100d10] border border-[#292428] flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-headline text-4xl font-black text-[#faf1f5] uppercase tracking-tight">Legal Clarity Needed?</h3>
            <p className="text-[#b0a9ad] text-lg font-light leading-relaxed">Our concierge legal team is available for enterprise inquiries.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 shrink-0">
            <button className="px-10 py-5 rounded-2xl border border-[#4b474a] font-black text-[10px] uppercase tracking-widest hover:bg-[#292428] transition-all text-[#faf1f5]">Contact Support</button>
            <button className="px-10 py-5 rounded-2xl bg-[#caa2f7] text-[#431f6b] font-black text-[10px] uppercase tracking-widest shadow-[0_15px_30px_rgba(202,162,247,0.3)] hover:brightness-110 transition-all">Compliance Hub</button>
          </div>
        </section>
      </div>
    </main>
  );
}