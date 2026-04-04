"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <header className="relative py-32 flex items-center justify-center overflow-hidden min-h-[60vh]">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-30 grayscale" 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2070" 
            alt="Riyadh Skyline"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#100d10]/0 via-[#100d10]/50 to-[#100d10]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 animate-fade-in">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-bold tracking-[0.2em] uppercase">
            ESTABLISHED 2024
          </span>
          <h1 className="text-6xl md:text-8xl font-headline font-black text-[#faf1f5] tracking-tighter mb-8 leading-[0.9] uppercase">
            Pioneering the <br/> 
            <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_20px_rgba(202,162,247,0.3)]">Digital Renaissance</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#b0a9ad] font-light max-w-3xl mx-auto leading-relaxed">
            We are the premier bridge between elite global talent and the monumental ambitions of Saudi Vision 2030.
          </p>
        </div>
      </header>

      {/* Vision Narrative */}
      <section className="py-32 bg-[#100d10]">
        <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-[#caa2f7] font-bold tracking-[0.2em] uppercase text-[10px]">Kingdom-First Ecosystem</span>
              <h2 className="text-5xl font-headline font-bold text-[#faf1f5] leading-tight">Aligning with the <br/> Ambition of a Nation.</h2>
            </div>
            <p className="text-lg text-[#b0a9ad] leading-relaxed font-light">
              BidJobs was born from a singular realization: the rapid transformation of the Kingdom requires a talent matching engine as sophisticated as the projects it fuels. From the cognitive city of NEOM to the cultural hub of Diriyah, we provide the human capital infrastructure that turns vision into reality.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="p-8 rounded-2xl bg-[#1c181c] border border-[#292428] hover:border-[#caa2f7]/30 transition-all duration-300 group">
                <div className="text-4xl font-headline text-[#caa2f7] font-black mb-2 group-hover:scale-110 transition-transform">2030</div>
                <p className="text-[10px] text-[#b0a9ad] font-bold uppercase tracking-widest">Vision Alignment</p>
              </div>
              <div className="p-8 rounded-2xl bg-[#1c181c] border border-[#292428] hover:border-[#caa2f7]/30 transition-all duration-300 group">
                <div className="text-4xl font-headline text-[#caa2f7] font-black mb-2 group-hover:scale-110 transition-transform">100%</div>
                <p className="text-[10px] text-[#b0a9ad] font-bold uppercase tracking-widest">Local Commitment</p>
              </div>
            </div>
          </div>
          <div className="relative group perspective-1000">
            <div className="absolute -inset-4 bg-[#caa2f7]/5 rounded-[3rem] blur-3xl group-hover:bg-[#caa2f7]/10 transition duration-700"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden border border-[#caa2f7]/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
              <img 
                className="w-full h-[650px] object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1578891752244-672ce74ae877?auto=format&fit=crop&q=80&w=2070" 
                alt="Architecture"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-40 bg-[#151215] border-y border-[#292428]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="mb-24 text-center space-y-4">
            <h2 className="text-5xl font-headline font-black uppercase tracking-tight">The Talent Impact</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#caa2f7] to-transparent mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 bg-[#1c181c] p-16 rounded-[2.5rem] border border-[#292428] flex flex-col justify-between hover:bg-[#221e22] transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-9xl text-[#caa2f7]">rocket_launch</span>
              </div>
              <span className="material-symbols-outlined text-[#caa2f7] text-6xl mb-12">rocket_launch</span>
              <div>
                <h3 className="text-7xl font-headline font-black text-[#faf1f5] mb-4 tracking-tighter">50k+</h3>
                <p className="text-[#b0a9ad] text-xl font-light">Professionals placed within Vision 2030 Giga-projects.</p>
              </div>
            </div>
            <div className="bg-[#1c181c] p-12 rounded-[2.5rem] border border-[#292428] flex flex-col justify-center text-center hover:border-[#caa2f7]/30 transition-all group">
              <h3 className="text-6xl font-headline font-black text-[#caa2f7] mb-4 group-hover:scale-110 transition-transform">85%</h3>
              <p className="text-[10px] text-[#b0a9ad] font-bold uppercase tracking-[0.2em]">Saudi Participation Rate</p>
            </div>
            <div className="bg-[#613471] p-12 rounded-[2.5rem] border border-[#caa2f7]/20 flex flex-col justify-center text-center shadow-[0_20px_40px_rgba(97,52,113,0.3)]">
              <h3 className="text-6xl font-headline font-black text-white mb-4 italic leading-none">12</h3>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">Sectors Disrupted</p>
            </div>
            <div className="bg-[#1c181c] p-16 rounded-[2.5rem] border border-[#292428] flex flex-col justify-center text-center md:col-span-2 hover:bg-[#221e22] transition-all">
              <h3 className="text-6xl font-headline font-black text-[#faf1f5] mb-4 tracking-tighter">SAR 1.2B</h3>
              <p className="text-[10px] text-[#b0a9ad] font-bold uppercase tracking-[0.2em]">Human Capital Value Generated</p>
            </div>
            <div className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] h-[350px] border border-[#292428]">
              <img 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
                src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=2070" 
                alt="Visionaries"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000]/90 via-[#000]/40 to-transparent flex items-end p-12">
                <p className="text-3xl font-headline italic text-white leading-tight font-light">"Reshaping the future of work in the cradle of civilization."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-40">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-5xl font-headline font-black tracking-tight uppercase leading-none">The Architects of BidJobs</h2>
              <p className="text-[#b0a9ad] text-xl font-light leading-relaxed">Our leadership combines global tech expertise with deep-rooted understanding of the Saudi industrial landscape.</p>
            </div>
            <Link href="/join" className="text-[#caa2f7] font-black text-xs tracking-[0.2em] uppercase border-b-2 border-[#caa2f7]/30 pb-2 hover:border-[#caa2f7] transition-all">
              Join the Board →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                name: "Dr. Khalid Al-Faisal", 
                role: "Founder & Chief Visionary", 
                desc: "Former advisor to the Ministry of Investment with 15 years in talent architecture.",
                img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1974"
              },
              { 
                name: "Sarah Bin Saud", 
                role: "Chief Operating Officer", 
                desc: "Lead scaling operations for three Saudi unicorns before joining the BidJobs mission.",
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1976"
              },
              { 
                name: "Mark Sterling", 
                role: "Chief Technology Officer", 
                desc: "AI pioneer specializing in predictive talent matching algorithms and secure HR-tech.",
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1974"
              }
            ].map((member) => (
              <div key={member.name} className="group">
                <div className="relative mb-10 overflow-hidden rounded-[2rem] bg-[#1c181c] border border-[#292428] aspect-[4/5]">
                  <img 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110" 
                    src={member.img} 
                    alt={member.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100d10] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </div>
                <h3 className="text-2xl font-headline font-black text-[#faf1f5] mb-2">{member.name}</h3>
                <p className="text-[#caa2f7] font-bold text-xs uppercase tracking-widest mb-6">{member.role}</p>
                <p className="text-[#b0a9ad] text-sm font-light leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}