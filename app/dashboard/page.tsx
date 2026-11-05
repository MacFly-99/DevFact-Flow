import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, FileText, Euro, ArrowRight, Clock, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuoteStatus } from "../../src/generated/prisma/client";
import { RevenueChart } from "@/components/revenue-chart";

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

  // 1. Calcul de la date d'il y a 6 mois
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [
    clientsCount,
    quotesCount,
    invoicesCount,
    acceptedQuotesAllTime, // Pour le CA global
    recentQuotes,
    quotesLastSixMonths   // Pour le graphique
  ] = await Promise.all([
    prisma.client.count({ where: { userId } }),
    prisma.quote.count({ where: { userId } }),
    prisma.invoice.count({ where: { userId } }),
    prisma.quote.findMany({ where: { userId, status: "ACCEPTED" }, select: { totalTTC: true } }),
    prisma.quote.findMany({ where: { userId }, include: { client: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    // On récupère les devis acceptés des 6 derniers mois
    prisma.quote.findMany({
      where: {
        userId,
        status: "ACCEPTED",
        createdAt: { gte: sixMonthsAgo }
      },
      select: { totalTTC: true, createdAt: true }
    })
  ]);

  const revenue = acceptedQuotesAllTime.reduce((acc, quote) => acc + quote.totalTTC, 0);

  // 2. Préparation des données pour le graphique (6 derniers mois)
  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      name: d.toLocaleString('fr-FR', { month: 'short' }), // ex: "janv."
      year: d.getFullYear(),
      month: d.getMonth(),
      revenue: 0
    };
  });

  quotesLastSixMonths.forEach(quote => {
    const qDate = new Date(quote.createdAt);
    const monthData = monthlyData.find(m => m.month === qDate.getMonth() && m.year === qDate.getFullYear());
    if (monthData) {
      monthData.revenue += quote.totalTTC;
    }
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Bonjour, <span className="text-brand-accent">{firstName}</span> 👋
        </h1>
        <p className="text-text-muted">Voici un résumé de votre activité aujourd'hui.</p>
      </div>

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg"><Users className="h-6 w-6 text-blue-400" /></div>
            <Link href="/clients" className="text-text-muted hover:text-brand-accent text-sm flex items-center gap-1">Voir <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <p className="text-text-muted text-sm font-medium mb-1">Total Clients</p>
          <p className="text-4xl font-bold">{clientsCount}</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg"><FileText className="h-6 w-6 text-purple-400" /></div>
            <Link href="/quotes" className="text-text-muted hover:text-brand-accent text-sm flex items-center gap-1">Voir <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <p className="text-text-muted text-sm font-medium mb-1">Total Devis</p>
          <p className="text-4xl font-bold">{quotesCount}</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-500/10 rounded-lg"><FileCheck className="h-6 w-6 text-orange-400" /></div>
            <Link href="/invoices" className="text-text-muted hover:text-brand-accent text-sm flex items-center gap-1">Voir <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <p className="text-text-muted text-sm font-medium mb-1">Total Factures</p>
          <p className="text-4xl font-bold">{invoicesCount}</p>
        </div>

        <div className="bg-linear-to-br from-brand-accent/20 to-brand-accent/5 border border-brand-accent/30 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Euro className="h-24 w-24 text-brand-accent" /></div>
          <div className="relative z-10">
            <div className="p-3 bg-brand-accent/20 rounded-lg w-fit mb-4"><Euro className="h-6 w-6 text-brand-accent" /></div>
            <p className="text-brand-accent text-sm font-medium mb-1">Chiffre d'Affaires</p>
            <p className="text-4xl font-bold text-white">{revenue.toFixed(2)} €</p>
          </div>
        </div>
      </div>

      {/* Graphique + Derniers devis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Graphique (2/3 de la largeur) */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Évolution du Chiffre d'Affaires (6 mois)</h2>
          <RevenueChart data={monthlyData} />
        </div>

        {/* Derniers devis (1/3 de la largeur) */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
            <h2 className="text-lg font-bold flex items-center gap-2"><Clock className="h-5 w-5 text-brand-accent" /> Derniers devis</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {recentQuotes.length === 0 ? (
              <div className="p-6 text-center text-text-muted text-sm">Aucun devis récent.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentQuotes.map((quote) => (
                  <Link href={`/quotes/${quote.id}`} key={quote.id} className="block p-4 hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm text-white truncate pr-2">{quote.client.companyName || quote.client.name}</p>
                      <p className="font-mono text-sm">{quote.totalTTC.toFixed(2)} €</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-text-muted">{new Date(quote.createdAt).toLocaleDateString('fr-FR')}</p>
                      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase border", getStatusStyle(quote.status))}>{quote.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 border-t border-white/10 bg-black/20 text-center">
            <Link href="/quotes" className="text-xs text-brand-accent hover:underline">Voir tous les devis</Link>
          </div>
        </div>
      </div>
    </div>
  );
}