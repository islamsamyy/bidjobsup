export default function PublicLoading() {
  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-16 space-y-12 animate-pulse">
      {/* Hero skeleton */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="h-4 w-40 bg-[#1c181c] rounded-full mx-auto" />
        <div className="h-12 w-96 bg-[#1c181c] rounded-lg mx-auto" />
        <div className="h-4 w-80 bg-[#1c181c] rounded mx-auto" />
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#1c181c] rounded-2xl p-8 space-y-4 h-64">
            <div className="w-12 h-12 bg-[#221e22] rounded-xl" />
            <div className="h-6 w-3/4 bg-[#221e22] rounded" />
            <div className="h-4 w-full bg-[#221e22] rounded" />
            <div className="h-4 w-2/3 bg-[#221e22] rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
