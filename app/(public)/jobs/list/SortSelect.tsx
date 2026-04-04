'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', val)
    router.push(`?${params.toString()}`)
  }

  return (
    <select 
      name="sort"
      className="bg-transparent border-none focus:ring-0 text-sm font-black text-[#caa2f7] cursor-pointer appearance-none pr-6"
      defaultValue={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
    >
      <option value="latest">Latest Arrivals</option>
      <option value="salary">Top Salary</option>
    </select>
  )
}
