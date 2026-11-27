export default function Loading() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-pulse">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="h-9 bg-white/10 rounded-lg w-48"></div>
        <div className="h-10 bg-white/10 rounded-md w-full md:w-40"></div>
      </div>

      {/* Liste des devis */}
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/10 h-24 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-3">
                <div className="h-6 bg-white/10 rounded w-24"></div>
                <div className="h-6 bg-white/10 rounded w-48"></div>
              </div>
              <div className="h-3 bg-white/5 rounded w-32"></div>
            </div>
            <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-2 md:mt-0">
              <div className="h-6 bg-white/10 rounded w-20"></div>
              <div className="h-6 bg-white/10 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}