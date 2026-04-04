"use client";

import Link from "next/link";

export default function Vision2030Page() {
  return (
    <main className="pt-24 pb-40">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover transform scale-110 motion-safe:animate-[pulse_10s_ease-in-out_infinite]" 
            src="https://images.unsplash.com/photo-1578891752244-672ce74ae877?auto=format&fit=crop&q=80&w=2070" 
            alt="Saudi Arabia Future"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#100d10]/50 via-[#100d10]/80 to-[#100d10]"></div>
        </div>
        
        <div className="relative z-10 text-center px-8 space-y-12 max-w-5xl mx-auto">
          <span className="inline-block px-6 py-2 rounded-full bg-[#caa2f7] text-[#431f6b] text-xs font-black tracking-[0.3em] uppercase animate-fade-in shadow-[0_0_30px_rgba(202,162,247,0.5)]">
            A Vision Realized
          </span>
          <h1 className="text-7xl md:text-9xl font-headline font-black text-[#faf1f5] leading-[0.8] tracking-tighter uppercase drop-shadow-2xl">
            Building the <br/>
            <span className="text-[#caa2f7] italic font-light">Kingdom's</span> Future
          </h1>
          <p className="text-2xl text-[#b0a9ad] font-light max-w-3xl mx-auto leading-relaxed">
            BidJobs is the digital ecosystem fueling the human capital transformation required for Saudi Vision 2030.
          </p>
        </div>
      </section>

      {/* Strategic Pillars */}
      <section className="py-40 bg-[#100d10]">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { 
              title: "A Vibrant Society", 
              desc: "Empowering Saudi citizens to achieve their highest potential within a world-class workforce environment.",
              icon: "diversity_1"
            },
            { 
              title: "A Thriving Economy", 
              desc: "Connecting high-growth sectors with elite global and local talent to accelerate non-oil economic participation.",
              icon: "trending_up"
            },
            { 
              title: "An Ambitious Nation", 
              desc: "Building the digital infrastructure for secure, transparent, and high-stakes career placement.",
              icon: "location_city"
            }
          ].map((pillar) => (
            <div key={pillar.title} className="space-y-8 p-12 rounded-[2.5rem] bg-[#1c181c] border border-[#292428] hover:border-[#caa2f7]/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#caa2f7]/5 rounded-full blur-3xl group-hover:bg-[#caa2f7]/10 transition-colors"></div>
              <span className="material-symbols-outlined text-[#caa2f7] text-6xl group-hover:scale-110 transition-transform inline-block">{pillar.icon}</span>
              <div className="space-y-4">
                <h3 className="text-3xl font-headline font-black text-[#faf1f5] uppercase tracking-tight">{pillar.title}</h3>
                <p className="text-[#b0a9ad] leading-relaxed font-light">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integration Narrative */}
      <section className="py-40 border-y border-[#292428]/30">
        <div className="max-w-screen-2xl mx-auto px-8 flex flex-col md:flex-row gap-32 items-center">
          <div className="md:w-1/2 relative group">
            <div className="absolute -inset-4 bg-[#caa2f7]/5 rounded-[3rem] blur-3xl group-hover:bg-[#caa2f7]/10 transition duration-700"></div>
            <div className="relative rounded-[3rem] overflow-hidden border border-[#caa2f7]/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
              <img 
                className="w-full h-[600px] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2070" 
                alt="Visionaries"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100d10] via-transparent to-transparent"></div>
            </div>
          </div>
          <div className="md:w-1/2 space-y-12 text-left">
            <h2 className="text-5xl md:text-7xl font-headline font-black text-[#faf1f5] leading-[0.9] tracking-tighter uppercase">
              Fueling the <br/>
              <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_20px_rgba(202,162,247,0.3)]">Giga-projects</span>
            </h2>
            <p className="text-xl text-[#b0a9ad] font-light leading-relaxed">
              From NEOM to the Red Sea, we provide the platform for the architects of tomorrow to build their legacies today. BidJobs is more than a marketplace; it is the human interface for the Kingdom's most ambitious goals.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="space-y-2">
                <span className="text-4xl font-headline font-black text-[#caa2f7]">12</span>
                <p className="text-[10px] text-[#b0a9ad] font-black uppercase tracking-widest leading-tight">Priority Sectors Supported</p>
              </div>
              <div className="space-y-2">
                <span className="text-4xl font-headline font-black text-[#faf1f5]">2030</span>
                <p className="text-[10px] text-[#b0a9ad] font-black uppercase tracking-widest leading-tight">Vision Alignment Index</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 text-center space-y-12">
        <h2 className="text-5xl font-headline font-black text-[#faf1f5] uppercase tracking-tight">Ready to Contribute to the Vision?</h2>
        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          <Link href="/join" className="px-12 py-6 bg-[#caa2f7] text-[#431f6b] font-black text-xs tracking-[0.2em] uppercase rounded-2xl shadow-[0_20px_40px_rgba(202,162,247,0.3)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Start Your Ascent
          </Link>
          <Link href="/contact" className="px-12 py-6 bg-[#1c181c] border border-[#292428] text-[#faf1f5] font-black text-xs tracking-[0.2em] uppercase rounded-2xl hover:bg-[#221e22] hover:border-[#caa2f7]/30 transition-all">
            Enterprise Partnerships
          </Link>
        </div>
      </section>
    </main>
  );
}
