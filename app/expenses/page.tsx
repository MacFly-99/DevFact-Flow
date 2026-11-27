import prisma from "@/lib/prisma";
import { Wallet, TrendingDown, Receipt, Activity } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ExpensesTable } from "@/components/expenses-table";
import { AddExpenseButton } from "@/components/add-expense-button";
import { ExpensesChart } from "@/components/expenses-chart";

export default async function ExpensesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/");

  // 1. Récupération des données via Prisma (sécurisé avec fallback tableau vide)
  const transactions = await prisma.expense.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" }
  }) || [];

  const quotes = await prisma.quote.findMany({
    where: { userId: session.user.id },
    include: { client: true },
  }) || [];

  const quoteMap = new Map(quotes.map(q => [q.id, { 
    number: q.number, 
    clientName: q.client.companyName || q.client.name,
    status: q.status
  }]));

  // 2. Calculs des totaux
  const totalGeneral = transactions.reduce((acc, tx) => acc + (tx.montant || 0), 0);

  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      name: d.toLocaleString('fr-FR', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
      total: 0
    };
  });

  transactions.forEach(tx => {
    // 3. Sécurité sur la date (évite le crash si date invalide)
    const txDate = tx.date ? new Date(tx.date) : null;
    if (txDate && !isNaN(txDate.getTime())) {
      const monthData = monthlyData.find(m => m.month === txDate.getMonth() && m.year === txDate.getFullYear());
      if (monthData) {
        monthData.total += (tx.montant || 0);
      }
    }
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Wallet className="h-8 w-8 text-brand-accent" />
            Analytics des Dépenses
          </h1>
          <p className="text-text-muted">Pilotez vos charges et suivez votre rentabilité.</p>
        </div>
        <AddExpenseButton />
      </div>

      {/* CARTES DU HAUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-linear-to-br from-red-500/20 to-red-500/5 border border-red-500/30 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown className="h-24 w-24 text-red-500" />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-red-500/20 rounded-lg w-fit mb-4">
              <Receipt className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-red-400 text-sm font-medium mb-1">Total des Dépenses</p>
            <p className="text-4xl font-bold text-white">{totalGeneral.toFixed(2)} €</p>
          </div>
        </div>

        {/* Nombre de transactions */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <p className="text-text-muted text-sm font-medium mb-1">Transactions enregistrées</p>
          <p className="text-4xl font-bold">{transactions.length}</p>
        </div>
      </div>

      {/* GRAPHIQUE D'ÉVOLUTION */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
        <h2 className="text-xl font-bold mb-6 text-white">Évolution des dépenses (6 mois)</h2>
        <ExpensesChart data={monthlyData} />
      </div>

      {/* TABLEAU */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 text-white">Toutes les transactions</h2>
        <ExpensesTable transactions={transactions} quoteMap={quoteMap} />
      </div>
      
    </div>
  );
}