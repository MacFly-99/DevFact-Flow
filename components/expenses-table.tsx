"use client";

import { useState, useTransition } from "react";
import { updateExpenseAction, deleteExpenseAction } from "@/app/expenses/actions";
import { Transaction } from "@/lib/devspend";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export function ExpensesTable({ transactions }: { transactions: Transaction[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTx) return;
    
    const formData = new FormData(e.currentTarget);
    const data = {
      description: formData.get("description") as string,
      montant: parseFloat(formData.get("montant") as string),
      categorie: formData.get("categorie") as string,
      date: formData.get("date") as string,
    };

    startTransition(async () => {
      const result = await updateExpenseAction(editingTx.id, data);
      if (result.success) {
        toast.success("Dépense modifiée !");
        setEditingTx(null);
      } else {
        toast.error("Erreur", { description: result.error });
      }
    });
  };

  const handleDelete = (id: number) => {
    startTransition(async () => {
      const result = await deleteExpenseAction(id);
      if (result.success) {
        toast.success("Dépense supprimée !");
      } else {
        toast.error("Erreur", { description: result.error });
      }
    });
  };

  if (transactions.length === 0) {
    return <p className="text-text-muted text-center py-8">Aucune dépense enregistrée.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-text-muted">
        <thead className="text-xs uppercase bg-black/20 text-gray-400 border-b border-white/10">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Catégorie</th>
            <th className="px-4 py-3 text-right">Montant</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-white/5 transition-colors">
              <td className="px-4 py-3">{new Date(tx.date).toLocaleDateString('fr-FR')}</td>
              <td className="px-4 py-3 font-medium text-white">{tx.description}</td>
              <td className="px-4 py-3">
                <span className="bg-white/10 px-2 py-1 rounded-md text-xs">{tx.categorie}</span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-red-400 font-bold">
                -{tx.montant.toFixed(2)} €
              </td>
              <td className="px-4 py-3 flex justify-center gap-2">
                
                <Dialog open={editingTx?.id === tx.id} onOpenChange={(open) => !open && setEditingTx(null)}>
                  <DialogTrigger render={
                    <button onClick={() => setEditingTx(tx)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors cursor-pointer" title="Modifier">
                      <Pencil className="h-4 w-4" />
                    </button>
                  } />
                  <DialogContent className="bg-brand-night border-white/10 text-white sm:max-w-106.25">
                    <DialogHeader>
                      <DialogTitle>Modifier la dépense</DialogTitle>
                    </DialogHeader>
                    {editingTx && (
                      <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                        <div>
                          <label className="text-sm text-gray-400">Description</label>
                          <input name="description" defaultValue={editingTx.description} required className="w-full bg-black/40 border border-white/10 rounded-md p-2 mt-1 text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-400">Montant (€)</label>
                            <input name="montant" type="number" step="0.01" defaultValue={editingTx.montant} required className="w-full bg-black/40 border border-white/10 rounded-md p-2 mt-1 text-white" />
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Date</label>
                            <input name="date" type="date" defaultValue={new Date(editingTx.date).toISOString().split('T')[0]} required className="w-full bg-black/40 border border-white/10 rounded-md p-2 mt-1 text-white" />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Catégorie</label>
                          <input name="categorie" defaultValue={editingTx.categorie} required className="w-full bg-black/40 border border-white/10 rounded-md p-2 mt-1 text-white" />
                        </div>
                        <DialogFooter className="pt-4">
                          <DialogClose render={<button type="button" className="px-4 py-2 text-sm text-gray-400 hover:text-white">Annuler</button>} />
                          <button type="submit" disabled={isPending} className="bg-brand-accent hover:bg-brand-accent/80 text-white px-4 py-2 rounded-md font-bold disabled:opacity-50">
                            {isPending ? "Enregistrement..." : "Enregistrer"}
                          </button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger render={
                    <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer" title="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  } />
                  <AlertDialogContent className="bg-brand-night border-red-500/30 border-2 text-text-main">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-400">Supprimer cette dépense ?</AlertDialogTitle>
                      <AlertDialogDescription className="text-text-muted">
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(tx.id)} disabled={isPending} className="bg-red-500 hover:bg-red-600 text-white font-bold">
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}