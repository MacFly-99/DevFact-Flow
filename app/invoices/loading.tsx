export default function Loading() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="h-8 bg-white/10 rounded w-48"></div>
        <div className="h-10 bg-white/10 rounded w-40"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white/5 rounded-lg border border-white/10"></div>
        ))}
      </div>
    </div>
  );
}