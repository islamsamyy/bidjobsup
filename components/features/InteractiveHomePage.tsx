'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/app/providers/LanguageProvider'

interface InteractiveHomePageProps {
  handleSearch?: (formData: FormData) => Promise<void>
}

export function InteractiveHomePage({ handleSearch }: InteractiveHomePageProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { t, dir } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY / scrollHeight
      setScrollProgress(scrolled)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-20px) rotateZ(5deg); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(202, 162, 247, 0.3)); }
          50% { filter: drop-shadow(0 0 40px rgba(202, 162, 247, 0.6)); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-ring {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(202, 162, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(202, 162, 247, 0);
          }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
        .animate-pulse-ring { animation: pulse-ring 2s infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(202, 162, 247, 0.2), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        /* Stagger animations for list items */
        .stagger-item:nth-child(1) { animation-delay: 0.1s; }
        .stagger-item:nth-child(2) { animation-delay: 0.2s; }
        .stagger-item:nth-child(3) { animation-delay: 0.3s; }
        .stagger-item:nth-child(4) { animation-delay: 0.4s; }
        .stagger-item:nth-child(5) { animation-delay: 0.5s; }
        .stagger-item:nth-child(6) { animation-delay: 0.6s; }

        /* Scroll progress bar */
        .scroll-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #caa2f7, #613471, #caa2f7);
          box-shadow: 0 0 20px rgba(202, 162, 247, 0.5);
          z-index: 9999;
        }

        /* Parallax background */
        .parallax {
          transform: translateY(var(--parallax-offset, 0px));
        }

        /* Interactive cards */
        .interactive-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .interactive-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
          z-index: 1;
        }

        .interactive-card:hover::before {
          left: 100%;
        }

        /* Text reveal animation */
        .text-reveal {
          position: relative;
          overflow: hidden;
        }

        .text-reveal span {
          display: inline-block;
          animation: slideUp 0.6s ease-out forwards;
        }
      `}</style>

      {/* Scroll progress bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Floating cursor effect */}
      <div
        className="pointer-events-none fixed w-8 h-8 border-2 border-[#caa2f7]/30 rounded-full z-50 transition-all duration-100"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          opacity: 0.5,
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden" dir={dir}>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#caa2f7]/5 rounded-full blur-[120px] -z-10 animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#eab3fa]/5 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-screen-2xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 space-y-10 animate-fade-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-bold tracking-[0.2em] uppercase">
              {t('homePage.empoweringVision2030')}
            </span>

            <h1 className="font-headline text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter mb-8 bg-gradient-to-br from-[#faf1f5] to-[#b0a9ad] bg-clip-text text-transparent">
              {t('homePage.headline')}<br />
              <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_20px_rgba(202,162,247,0.3)]">
                {t('homePage.headlineSecond')}
              </span>
            </h1>

            <p className="text-xl text-[#b0a9ad] max-w-xl leading-relaxed font-light">
              {t('homePage.subtitle')}
            </p>

            <form action={handleSearch} className="p-2.5 rounded-2xl bg-[#1c181c]/50 backdrop-blur-xl border border-[#4b474a]/20 shadow-2xl flex flex-col md:flex-row gap-3 max-w-3xl group hover:border-[#caa2f7]/20 transition-all duration-300">
              <div className="flex-1 flex items-center gap-4 px-5 py-4 bg-[#100d10] border border-[#292428] rounded-xl focus-within:border-[#caa2f7]/50 focus-within:shadow-[0_0_15px_rgba(202,162,247,0.1)] transition-all">
                <span className="material-symbols-outlined text-[#caa2f7] text-2xl">work</span>
                <input
                  name="query"
                  className="bg-transparent border-none text-[#faf1f5] focus:ring-0 w-full placeholder:text-[#4b474a] text-sm font-medium"
                  placeholder={t('homePage.searchPlaceholder')}
                  type="text"
                />
              </div>
              <div className="flex-1 flex items-center gap-4 px-5 py-4 bg-[#100d10] border border-[#292428] rounded-xl focus-within:border-[#caa2f7]/50 focus-within:shadow-[0_0_15px_rgba(202,162,247,0.1)] transition-all">
                <span className="material-symbols-outlined text-[#caa2f7] text-2xl">location_on</span>
                <input
                  name="location"
                  className="bg-transparent border-none text-[#faf1f5] focus:ring-0 w-full placeholder:text-[#4b474a] text-sm font-medium"
                  placeholder={t('homePage.locationPlaceholder')}
                  type="text"
                />
              </div>
              <button
                type="submit"
                className="bg-[#caa2f7] hover:bg-[#bc95e9] text-[#431f6b] font-black px-10 py-4 rounded-xl shadow-[0_4px_20px_rgba(202,162,247,0.3)] hover:scale-[0.98] transition-all duration-200"
              >
                {t('homePage.searchButton')}
              </button>
            </form>
          </div>

          <div className="relative group perspective-1000 h-[650px] flex items-center justify-center">
            {/* Animated background orbs */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#caa2f7]/15 rounded-full blur-[100px] group-hover:bg-[#caa2f7]/25 transition-colors duration-1000 animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#613471]/15 rounded-full blur-[100px] group-hover:bg-[#613471]/25 transition-colors duration-1000 animate-pulse delay-500"></div>

            {/* BidJobs Logo SVG Container */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-12">
              <svg
                className="animate-float animate-glow w-64 h-64"
                viewBox="0 0 240 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Palm Leaves */}
                <path d="M120 20 Q130 50 125 80" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.8"/>
                <path d="M120 20 Q110 50 115 80" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.8"/>
                <path d="M120 20 Q145 45 160 70" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.7"/>
                <path d="M120 20 Q95 45 80 70" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.7"/>
                <path d="M120 20 Q155 55 170 95" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.6"/>
                <path d="M120 20 Q85 55 70 95" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.6"/>
                <path d="M120 20 Q160 70 160 120" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.5"/>
                <path d="M120 20 Q80 70 80 120" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.5"/>

                {/* Building */}
                <rect x="90" y="100" width="60" height="80" fill="#caa2f7" opacity="0.9"/>
                <rect x="95" y="105" width="50" height="70" fill="#100d10"/>

                {/* Windows */}
                {[0, 1, 2].map((row) => (
                  [0, 1, 2, 3].map((col) => (
                    <rect
                      key={`window-${row}-${col}`}
                      x={97 + col * 12}
                      y={107 + row * 18}
                      width="10"
                      height="10"
                      fill="#caa2f7"
                      opacity="0.6"
                    />
                  ))
                ))}
              </svg>

              <div className="text-center max-w-md">
                <h3 className="text-3xl font-headline font-bold text-[#caa2f7] mb-2">BidJobs Platform</h3>
                <p className="text-sm text-[#b0a9ad]">Where elite talent builds tomorrow's vision</p>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute bottom-12 -left-12 z-20 p-8 bg-[#100d10]/80 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-[#caa2f7]/20 max-w-[280px] group-hover:translate-x-4 transition-transform duration-500 hover:scale-105">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#caa2f7] to-[#613471] flex items-center justify-center shadow-[0_0_15px_rgba(202,162,247,0.3)] animate-pulse">
                  <span className="material-symbols-outlined text-white text-3xl">trending_up</span>
                </div>
                <div>
                  <p className="text-[10px] text-[#b0a9ad] uppercase tracking-widest font-bold">Active Projects</p>
                  <p className="font-headline font-bold text-[#faf1f5] text-lg">NEOM High-Speed Link</p>
                </div>
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#100d10] bg-gradient-to-br from-[#caa2f7] to-[#613471] overflow-hidden hover:scale-110 transition-transform">
                    <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="user" />
                  </div>
                ))}
                <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#100d10] bg-[#caa2f7] text-[10px] font-black text-[#431f6b] hover:scale-110 transition-transform">12k+</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function StatCard({ value, label }: { value: string; label: string }) {
  const { dir } = useLanguage()
  return (
    <div className="group stagger-item animate-slide-up" dir={dir}>
      <div className="relative">
        <div className="h-20 mb-3 flex items-center justify-center">
          <span className="font-headline text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#caa2f7] to-[#613471] group-hover:scale-110 transition-transform duration-300">
            {value}
          </span>
        </div>
        <div className="absolute inset-0 blur-2xl bg-[#caa2f7]/20 group-hover:bg-[#caa2f7]/40 transition-all duration-300 -z-10 rounded-full"></div>
      </div>
      <p className="text-[#b0a9ad] font-bold text-[10px] uppercase tracking-[0.2em] text-center">{label}</p>
    </div>
  )
}

export function JobCard({ job, index }: any) {
  const { dir } = useLanguage()
  return (
    <div
      className="interactive-card group stagger-item animate-slide-up flex flex-col md:flex-row items-center justify-between p-10 bg-[#1c181c]/50 border border-[#292428] rounded-[2.5rem] hover:bg-[#1c181c] hover:border-[#caa2f7]/50 hover:shadow-[0_20px_60px_rgba(202,162,247,0.15)] transition-all duration-500 cursor-pointer relative"
      style={{ animationDelay: `${index * 100}ms` }}
      dir={dir}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#caa2f7]/0 via-[#caa2f7]/5 to-[#caa2f7]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2.5rem]"></div>

      <div className="flex items-center gap-8 mb-8 md:mb-0 relative z-10">
        <div className="w-20 h-20 rounded-[1.5rem] bg-[#100d10] flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(202,162,247,0.2)] transition-all overflow-hidden shrink-0">
          {job.employer?.avatar_url ? (
            <img src={job.employer.avatar_url} alt={job.employer?.company_name} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-[#caa2f7] text-4xl">corporate_fare</span>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2 group-hover:text-[#caa2f7] transition-colors duration-300">{job.title}</h3>
          <p className="text-[#b0a9ad] text-sm flex items-center gap-3">
            <span className="font-bold text-[#faf1f5]/80">{job.employer?.company_name || job.employer?.full_name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4b474a]"></span>
            {job.employer?.location || "Remote"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8 relative z-10">
        <div className="text-right">
          <p className="text-[#b0a9ad] text-xs mb-2">BUDGET RANGE</p>
          <p className="font-bold text-lg text-[#caa2f7]">
            ${job.budget_min}–${job.budget_max}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#caa2f7] to-[#613471] flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
          <span className="material-symbols-outlined text-white group-hover:rotate-45 transition-transform duration-300">arrow_outward</span>
        </div>
      </div>
    </div>
  )
}
