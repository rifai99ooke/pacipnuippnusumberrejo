export default function PageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-48 bg-green-600/20" />
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="h-6 bg-gray-200 rounded-full w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="h-40 bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded-full w-3/4" />
              <div className="h-3 bg-gray-200 rounded-full w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
