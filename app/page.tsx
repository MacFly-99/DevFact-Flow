export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          DevFact <span className="text-brand-accent">Flow</span>
        </h1>
        <p className="text-xl text-text-muted max-w-2xl">
          L'outil de devis et facturation ultra pro.
        </p>
        <button className="bg-brand-accent text-brand-night px-6 py-3 rounded-md font-bold hover:bg-brand-accent/90 transition-colors">
          Créer mon premier devis
        </button>
      </div>
    </main>
  );
}