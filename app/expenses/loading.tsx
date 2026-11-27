export default function Loading() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <div className="h-10 bg-white/10 rounded-lg w-64 mb-3"></div>
          <div className="h-4 bg-white/5 rounded w-48"></div>
        </div>
        <div className="h-10 bg-white/10 rounded-md w-40"></div>
      </div>

      {/* Cartes Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="h-40 bg-white/5 rounded-xl border border-white/10"></div>
        <div className="h-40 bg-white/5 rounded-xl border border-white/10"></div>
      </div>

      {/* Graphique Skeleton */}
      <div className="h-80 bg-white/5 rounded-xl border border-white/10 mb-10"></div>

      {/* Tableau Skeleton */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="h-6 bg-white/10 rounded w-48 mb-6"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg border border-white/10"></div>
          ))}
        </div>
      </div>
    </div>
  );
}