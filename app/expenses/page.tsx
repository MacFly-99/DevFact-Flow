import { getSpendSummary, getTransactions } from "@/lib/devspend";
import { Wallet, TrendingDown, PieChart, Receipt } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ExpensesTable } from "@/components/expenses-table";
import { AddExpenseButton } from "@/components/add-expense-button";

export default async function ExpensesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/");

  // On récupère les stats ET la liste des transactions en parallèle
  const [spendData, transactions] = await Promise.all([
    getSpendSummary(),
    getTransactions()
  ]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      
      {/* En-tête avec le Titre et le Bouton d'ajout */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Wallet className="h-8 w-8 text-brand-accent" />
            Analytics des Dépenses
          </h1>
          <p className="text-text-muted">Suivi de vos charges via le micro-service DevSpend-Flow.</p>
        </div>
        
        {/* Le bouton "Nouvelle Dépense" */}
        <AddExpenseButton />
      </div>

      {/* Cartes de Statistiques */}
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
            <p className="text-4xl font-bold text-white">{spendData.total_general.toFixed(2)} €</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <PieChart className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <p className="text-text-muted text-sm font-medium mb-1">Catégories actives</p>
          <p className="text-4xl font-bold">{spendData.total_par_categorie.length}</p>
        </div>
      </div>

      {/* Le tableau interactif des transactions */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
        <h2 className="text-xl font-bold mb-6 text-white">Toutes les transactions</h2>
        <ExpensesTable transactions={transactions} />
      </div>

      {/* Graphique de répartition par catégorie */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 text-white">Répartition par catégorie</h2>
        {spendData.total_par_categorie.length === 0 ? (
          <p className="text-text-muted text-center py-8">Aucune dépense enregistrée pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {spendData.total_par_categorie.map((cat, index) => {
              const percentage = spendData.total_general > 0 
                ? (cat.total / spendData.total_general) * 100 
                : 0;

              return (
                <div key={index} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm text-gray-300 group-hover:text-white transition-colors">
                      {cat.categorie}
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      {cat.total.toFixed(2)} €
                    </span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-brand-accent h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
    </div>
  );
}