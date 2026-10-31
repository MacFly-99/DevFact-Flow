import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Mes Devis</h1>
        <Link 
          href="/quotes/new" 
          className="w-full md:w-auto text-center bg-brand-accent text-brand-night px-4 py-2 rounded-md font-bold hover:bg-brand-accent/90 transition-colors"
        >
          + Nouveau Devis
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
          <p className="text-text-muted text-lg mb-4">Tu n'as pas encore de devis.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {quotes.map((quote) => (
            <Link 
              href={`/quotes/${quote.id}`} 
              key={quote.id} 
              className="flex bg-white/5 p-4 rounded-lg border border-white/10 flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/10 hover:border-brand-accent/50 transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded text-sm group-hover:bg-brand-accent/20 transition-colors">
                    {quote.number}
                  </span>
                  <h3 className="font-bold text-lg text-text-main">
                    {/* On affiche l'entreprise si elle existe, sinon le nom du contact */}
                    {quote.client.companyName || quote.client.name}
                  </h3>
                </div>
                <p className="text-xs text-text-muted">
                  Créé le {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div className="text-left md:text-right w-full md:w-auto flex md:block justify-between items-center border-t md:border-t-0 border-white/10 pt-3 md:pt-0 mt-2 md:mt-0">
                <p className="font-bold text-lg">{quote.total.toFixed(2)} €</p>
                <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded-full uppercase tracking-wider text-text-muted group-hover:text-brand-accent transition-colors">
                  {quote.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}