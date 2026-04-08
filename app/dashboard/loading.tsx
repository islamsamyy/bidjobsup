export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12 space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-32 bg-surface-container rounded-lg" />
        <div className="h-10 w-64 bg-surface-container rounded-lg" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface-container rounded-2xl p-8 space-y-4">
            <div className="h-3 w-20 bg-surface-bright rounded" />
            <div className="h-8 w-16 bg-surface-bright rounded" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="bg-surface-container rounded-2xl p-8 space-y-6">
        <div className="h-6 w-48 bg-surface-bright rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-surface-bright rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-surface-bright rounded" />
              <div className="h-3 w-1/2 bg-surface-bright rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
