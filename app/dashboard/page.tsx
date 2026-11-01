import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, FileText, Euro, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuoteStatus } from "../../src/generated/prisma/client";

// Petite fonction pour les couleurs de statut
function getStatusStyle(status: QuoteStatus) {
  switch (status) {
    case "ACCEPTED": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "REJECTED": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "SENT": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default: return "bg-brand-accent/20 text-brand-accent border-brand-accent/30";
  }
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/");

  const userId = session.user.id;
  const firstName = session.user.name?.split(" ")[0] || "Chef";

  // 1. Récupération des données en parallèle (optimisation)
  const [
    clientsCount,
    quotesCount,
    acceptedQuotes,
    recentQuotes
  ] = await Promise.all([
    prisma.client.count({ where: { userId } }),
    prisma.quote.count({ where: { userId } }),
    // On récupère tous les devis acceptés pour calculer le CA
    prisma.quote.findMany({ 
      where: { userId, status: "ACCEPTED" },
      select: { total: true }
    }),
    // Les 5 derniers devis créés
    prisma.quote.findMany({
      where: { userId },
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    })
  ]);

  // Calcul du Chiffre d'Affaires (somme des totaux des devis acceptés)
  const revenue = acceptedQuotes.reduce((acc, quote) => acc + quote.total, 0);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      
      {/* En-tête de bienvenue */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Bonjour, <span className="text-brand-accent">{firstName}</span> 👋
        </h1>
        <p className="text-text-muted">Voici un résumé de votre activité aujourd'hui.</p>
      </div>

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Carte Clients */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <Link href="/clients" className="text-text-muted hover:text-brand-accent text-sm flex items-center gap-1">
              Voir <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <p className="text-text-muted text-sm font-medium mb-1">Total Clients</p>
          <p className="text-4xl font-bold">{clientsCount}</p>
        </div>

        {/* Carte Devis */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <FileText className="h-6 w-6 text-purple-400" />
            </div>
            <Link href="/quotes" className="text-text-muted hover:text-brand-accent text-sm flex items-center gap-1">
              Voir <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <p className="text-text-muted text-sm font-medium mb-1">Total Devis</p>
          <p className="text-4xl font-bold">{quotesCount}</p>
        </div>

        {/* Carte Chiffre d'Affaires */}
        <div className="bg-linear-to-br from-brand-accent/20 to-brand-accent/5 border border-brand-accent/30 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Euro className="h-24 w-24 text-brand-accent" />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-brand-accent/20 rounded-lg w-fit mb-4">
              <Euro className="h-6 w-6 text-brand-accent" />
            </div>
            <p className="text-brand-accent text-sm font-medium mb-1">Chiffre d'Affaires (Accepté)</p>
            <p className="text-4xl font-bold text-white">{revenue.toFixed(2)} €</p>
          </div>
        </div>

      </div>

      {/* Section : Derniers Devis */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-accent" /> Derniers devis
          </h2>
          <Link href="/quotes" className="text-sm text-brand-accent hover:underline">
            Tout voir
          </Link>
        </div>

        {recentQuotes.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-text-muted mb-4">Vous n'avez pas encore créé de devis.</p>
            <Link href="/quotes/new" className="bg-brand-accent text-brand-night px-4 py-2 rounded-md font-bold text-sm">
              Créer mon premier devis
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentQuotes.map((quote) => (
              <Link 
                href={`/quotes/${quote.id}`} 
                key={quote.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 hover:bg-white/5 transition-colors gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-brand-accent bg-brand-accent/10 px-2 py-1 rounded">
                    {quote.number}
                  </span>
                  <div>
                    <p className="font-bold text-white">{quote.client.companyName || quote.client.name}</p>
                    <p className="text-xs text-text-muted">{new Date(quote.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <p className="font-mono font-bold">{quote.total.toFixed(2)} €</p>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border",
                    getStatusStyle(quote.status)
                  )}>
                    {quote.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}