'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/app/providers/LanguageProvider'

export function InteractiveHomePage() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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
