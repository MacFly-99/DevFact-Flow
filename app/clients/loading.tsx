export default function Loading() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-pulse">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="h-9 bg-white/10 rounded-lg w-48"></div>
        <div className="h-10 bg-white/10 rounded-md w-full md:w-40"></div>
      </div>

      {/* Liste des clients */}
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-white/5 rounded-lg border border-white/10 p-4 flex flex-col justify-center gap-3">
            <div className="h-4 bg-white/10 rounded w-1/4"></div>
            <div className="h-6 bg-white/10 rounded w-1/3"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}