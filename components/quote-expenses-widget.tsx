import { getTransactions } from "@/lib/devspend";
import { AddExpenseButton } from "./add-expense-button";
import { Wallet, TrendingUp, AlertCircle, Lock } from "lucide-react";

export async function QuoteExpensesWidget({ 
  quoteId, 
  quoteTotalTTC, 
  quoteStatus 
}: { 
  quoteId: string, 
  quoteTotalTTC: number, 
  quoteStatus: string 
}) {
  const expenses = await getTransactions(quoteId);
  
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.montant, 0);
  const netProfit = quoteTotalTTC - totalExpenses;
  const isProfitable = netProfit > 0;
  
  const isLocked = quoteStatus === "ACCEPTED" || quoteStatus === "PAID";

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wallet className="h-6 w-6 text-brand-accent" />
          Coûts & Rentabilité
        </h2>
        
        {/* Condition d'affichage du bouton ou du cadenas */}
        {isLocked ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md font-medium text-sm">
            <Lock className="h-4 w-4" />
            {quoteStatus === "PAID" ? "Facture payée" : "Devis accepté"} - Dépenses verrouillées
          </div>
        ) : (
          <AddExpenseButton quoteId={quoteId} variant="outline" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-black/20 border border-white/5 p-4 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Total des dépenses</p>
          <p className="text-2xl font-bold text-red-400">-{totalExpenses.toFixed(2)} €</p>
        </div>

        <div className={`p-4 rounded-lg border ${isProfitable ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <p className={`text-sm mb-1 ${isProfitable ? 'text-green-400/80' : 'text-red-400/80'}`}>Bénéfice net estimé</p>
          <div className="flex items-center gap-2">
            <p className={`text-2xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
              {netProfit.toFixed(2)} €
            </p>
            {isProfitable ? <TrendingUp className="h-5 w-5 text-green-400" /> : <AlertCircle className="h-5 w-5 text-red-400" />}
          </div>
        </div>

        <div className="bg-black/20 border border-white/5 p-4 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Marge</p>
          <p className="text-2xl font-bold text-white">
            {quoteTotalTTC > 0 ? ((netProfit / quoteTotalTTC) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {expenses.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Détail des charges</h3>
          {expenses.map((exp) => (
            <div key={exp.id} className="flex justify-between items-center p-3 bg-black/20 rounded-md border border-white/5">
              <div>
                <p className="text-white font-medium">{exp.description}</p>
                <p className="text-xs text-gray-500">{new Date(exp.date).toLocaleDateString('fr-FR')} • {exp.categorie}</p>
              </div>
              <p className="font-mono text-red-400">-{exp.montant.toFixed(2)} €</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic text-center py-4 bg-black/20 rounded-md">
          Aucune dépense enregistrée pour ce projet. Votre marge est de 100%.
        </p>
      )}
    </div>
  );
}