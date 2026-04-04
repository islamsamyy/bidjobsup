'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

interface FilterSidebarProps {
  initialCategory: string
  initialRemote: boolean
  initialMinSalary: number
}

export default function FilterSidebar({ 
  initialCategory, 
  initialRemote, 
  initialMinSalary 
}: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [category, setCategory] = useState(initialCategory || "All")
  const [remote, setRemote] = useState(initialRemote)
  const [minSalary, setMinSalary] = useState(initialMinSalary)

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (category && category !== "All") {
      params.set('c', category)
    } else {
      params.delete('c')
    }

    if (remote) {
      params.set('remote', 'true')
    } else {
      params.delete('remote')
    }

    if (minSalary > 0) {
      params.set('minSalary', minSalary.toString())
    } else {
      params.delete('minSalary')
    }

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <div className="mb-10">
      <h2 className="font-headline text-2xl font-bold mb-6 tracking-tight text-[#faf1f5]">Refine Results</h2>
      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad] mb-4 block">Role Type</label>
          <div className="flex flex-wrap gap-2">
            {["All", "Design", "Engineering", "Product", "Marketing"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  category === cat
                    ? "bg-[#613471] text-[#f1bfff] border border-[#f1bfff]/20"
                    : "bg-[#1c181c] text-[#b0a9ad] border border-[#292428] hover:bg-[#221e22]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad] mb-4 block">Location Preference</label>
          <div className="space-y-4">
            <label className="flex items-center group cursor-pointer">
              <input 
                type="checkbox" 
                checked={remote}
                onChange={(e) => setRemote(e.target.checked)}
                className="rounded border-[#4b474a] bg-[#100d10] text-[#caa2f7] focus:ring-[#caa2f7]/20 w-4 h-4"
              />
              <span className="ml-3 text-sm text-[#b0a9ad] group-hover:text-[#caa2f7] transition-colors">Remote First</span>
            </label>
            <label className="flex items-center group cursor-pointer opacity-50">
              <input type="checkbox" disabled className="rounded border-[#4b474a] bg-[#100d10] w-4 h-4" />
              <span className="ml-3 text-sm text-[#b0a9ad]">On-site (Coming soon)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad] mb-4 block">
            Min compensation (From ${minSalary.toLocaleString()})
          </label>
          <input 
            type="range" 
            min="0"
            max="350000"
            step="10000"
            value={minSalary}
            onChange={(e) => setMinSalary(parseInt(e.target.value))}
            className="w-full accent-[#caa2f7] bg-[#1c181c] h-1.5 rounded-full appearance-none cursor-pointer" 
          />
          <div className="flex justify-between mt-3">
            <span className="text-[10px] font-bold text-[#b0a9ad] tracking-wider">$0</span>
            <span className="text-[10px] font-bold text-[#b0a9ad] tracking-wider">$350k+</span>
          </div>
        </div>

        <div className="pt-6">
          <button 
            onClick={applyFilters}
            disabled={isPending}
            className="w-full py-4 bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] font-black rounded-xl text-xs uppercase tracking-widest transition-transform active:scale-95 shadow-lg shadow-[#caa2f7]/10 disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Apply Filters"}
          </button>
        </div>
      </div>
    </div>
  )
}
