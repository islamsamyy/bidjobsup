"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: "Talent Starter",
      tagline: "For those beginning their ascent.",
      price: "0",
      features: [
        "Standard Job Search",
        "Basic Profile Builder",
        "Public Portfolio",
        "Community Access"
      ],
      cta: "Start for Free",
      featured: false,
      blocked: ["ATS Optimizer", "Priority Role Access", "Profile Boost"]
    },
    {
      name: "Elite Professional",
      tagline: "The definitive toolset for high-end roles.",
      price: isYearly ? "15" : "19",
      features: [
        "AI ATS Optimizer (Unlimited)",
        "Priority Role Access",
        "Profile Boost in Search",
        "Advanced Application Tracking",
        "Salary Benchmarking",
        "Direct Inbox Access"
      ],
      cta: "Upgrade Now",
      featured: true,
      blocked: []
    },
    {
      name: "Visionary Enterprise",
      tagline: "For organizations shaping the Kingdom.",
      price: "Custom",
      features: [
        "Dedicated Success Manager",
        "API & ERP Integration",
        "Custom Employer Branding",
        "Bulk Video Interviewing",
        "White-label Talent Portal",
        "Advanced Analytics"
      ],
      cta: "Contact Us",
      featured: false,
      blocked: []
    }
  ];

  return (
    <main className="pt-24 pb-40">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <h1 className="font-headline text-6xl md:text-8xl font-black mb-8 tracking-tighter text-[#faf1f5] uppercase leading-[0.9]">
          Invest in Your <br/>
          <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_20px_rgba(202,162,247,0.3)]">Career Legacy</span>
        </h1>
        <p className="text-[#b0a9ad] max-w-2xl mx-auto text-xl font-light leading-relaxed mb-16">
          Join the elite tier of Saudi talent. From AI-driven ATS optimization to exclusive high-stakes roles, BidJobs provides the tools for Vision 2030 excellence.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-6 mb-20">
          <span className={`text-sm font-bold tracking-widest uppercase transition-colors ${!isYearly ? 'text-[#faf1f5]' : 'text-[#b0a9ad]'}`}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-16 h-8 bg-[#1c181c] rounded-full p-1.5 flex items-center border border-[#292428] relative transition-all duration-300"
          >
            <div className={`w-5 h-5 bg-[#caa2f7] rounded-full shadow-[0_0_15px_rgba(202,162,247,0.5)] transition-transform duration-300 ${isYearly ? 'translate-x-8' : 'translate-x-0'}`}></div>
          </button>
          <span className={`text-sm font-bold tracking-widest uppercase transition-colors ${isYearly ? 'text-[#faf1f5]' : 'text-[#b0a9ad]'}`}>
            Yearly <span className="text-[#caa2f7] ml-2 text-[10px] bg-[#613471]/30 px-2 py-0.5 rounded-full border border-[#caa2f7]/20">Save 20%</span>
          </span>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-12">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col p-12 rounded-[2.5rem] transition-all duration-500 group ${
                plan.featured 
                ? 'bg-[#1c181c] border-2 border-[#caa2f7] shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_30px_rgba(202,162,247,0.1)] scale-105 z-10' 
                : 'bg-[#151215] border border-[#292428] hover:border-[#caa2f7]/30'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#caa2f7] text-[#431f6b] px-8 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-[0_10px_20px_rgba(202,162,247,0.3)]">
                  Most Popular
                </div>
              )}
              
              <div className="text-left mb-12">
                <h3 className={`text-3xl font-headline font-black mb-3 ${plan.featured ? 'text-[#caa2f7]' : 'text-[#faf1f5]'}`}>{plan.name}</h3>
                <p className="text-[#b0a9ad] text-sm font-light min-h-[40px] uppercase tracking-wider">{plan.tagline}</p>
              </div>

              <div className="text-left mb-12 flex items-baseline gap-2">
                {plan.price !== "Custom" && <span className="text-sm font-bold text-[#b0a9ad] uppercase tracking-widest">SAR</span>}
                <span className="text-6xl font-headline font-black text-[#faf1f5] tracking-tighter">
                  {plan.price}
                </span>
                {plan.price !== "Custom" && plan.price !== "Free" && (
                  <span className="text-sm font-bold text-[#b0a9ad] uppercase tracking-widest">/mo</span>
                )}
              </div>

              <div className="space-y-6 mb-12 flex-grow">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-4 group/item">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${plan.featured ? 'bg-[#caa2f7]/10' : 'bg-[#292428]'}`}>
                      <span className="material-symbols-outlined text-[14px] text-[#caa2f7] font-bold">check</span>
                    </div>
                    <span className="text-[#faf1f5] text-sm font-medium tracking-tight group-hover/item:translate-x-1 transition-transform">{feature}</span>
                  </div>
                ))}
                {plan.blocked?.map((feature) => (
                  <div key={feature} className="flex items-center gap-4 opacity-30 grayscale">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#292428]">
                      <span className="material-symbols-outlined text-[14px] text-[#b0a9ad]">lock</span>
                    </div>
                    <span className="text-[#b0a9ad] text-sm font-light line-through">{feature}</span>
                  </div>
                ))}
              </div>

              <Link 
                href={plan.price === "Custom" ? "mailto:sales@bidjobs.sa" : "/join"}
                className={`w-full py-6 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 transform active:scale-95 ${
                  plan.featured 
                  ? 'bg-gradient-to-br from-[#caa2f7] to-[#b690e3] text-[#431f6b] shadow-[0_20px_40px_rgba(202,162,247,0.3)] hover:brightness-110' 
                  : 'bg-[#1c181c] border border-[#292428] text-[#faf1f5] hover:bg-[#221e22] hover:border-[#caa2f7]/30'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Spotlight: ATS Optimizer */}
      <section className="py-40 bg-[#151215] border-y border-[#292428]/30">
        <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row gap-24 items-center">
          <div className="lg:w-1/2 space-y-10 text-left">
            <span className="inline-block px-4 py-1 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-black tracking-[0.2em] uppercase">
              Premium Intelligence
            </span>
            <h2 className="text-5xl font-headline font-black text-[#faf1f5] leading-[0.9] tracking-tighter uppercase">
              Defeat the <br /> 
              <span className="text-[#caa2f7] italic font-light">Algorithm</span>
            </h2>
            <p className="text-xl text-[#b0a9ad] font-light leading-relaxed">
              Our ATS Optimizer analyzes your CV against high-tier job descriptions in real-time, suggesting linguistic adjustments to ensure you land in the "Shortlist" pile consistently.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="space-y-4">
                <span className="material-symbols-outlined text-[#caa2f7] text-4xl">psychology</span>
                <h4 className="text-lg font-bold text-[#faf1f5] tracking-tight">Neural Mapping</h4>
                <p className="text-sm text-[#b0a9ad] font-light">Matches experience with Saudi Giga-project standards.</p>
              </div>
              <div className="space-y-4">
                <span className="material-symbols-outlined text-[#caa2f7] text-4xl">description</span>
                <h4 className="text-lg font-bold text-[#faf1f5] tracking-tight">Structure Audit</h4>
                <p className="text-sm text-[#b0a9ad] font-light">Readable by all major global enterprise HR platforms.</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative group">
            <div className="absolute -inset-4 bg-[#caa2f7]/5 rounded-[3rem] blur-3xl group-hover:bg-[#caa2f7]/10 transition duration-700"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden border border-[#caa2f7]/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] aspect-video">
              <img 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
                alt="AI Analytics"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100d10] via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-40 max-w-4xl mx-auto px-8">
        <h2 className="text-4xl font-headline font-black text-center mb-24 tracking-tight uppercase">Common Decoded Questions</h2>
        <div className="space-y-6">
          {[
            { 
              q: "Can I cancel my Elite Professional subscription at any time?", 
              a: "Yes. We believe in total flexibility. You can cancel your subscription at any time with no penalties. Access remains until the end of your billing cycle."
            },
            { 
              q: "Does the ATS Optimizer work for Arabic CVs?", 
              a: "Absolutely. Our system is localized specifically for Saudi Arabia, supporting both Modern Standard Arabic and English industry terminology used in the Kingdom's evolving sectors."
            },
            { 
              q: "What makes 'Visionary Enterprise' different?", 
              a: "Enterprise users receive unlimited job postings, customized vetting pipelines, and dedicated support from our human capital architects in Riyadh."
            }
          ].map((faq, i) => (
            <details key={i} className="group bg-[#1c181c] border border-[#292428] rounded-3xl overflow-hidden hover:border-[#caa2f7]/30 transition-all">
              <summary className="flex justify-between items-center p-10 cursor-pointer list-none list-outside">
                <h4 className="text-lg font-bold text-[#faf1f5] tracking-tight">{faq.q}</h4>
                <span className="material-symbols-outlined text-[#caa2f7] group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-10 pb-10 border-t border-[#292428]/50 pt-8">
                <p className="text-[#b0a9ad] font-light leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}