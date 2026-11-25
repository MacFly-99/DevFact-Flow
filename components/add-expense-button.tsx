"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addExpenseAction } from "@/app/expenses/actions";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose
} from "@/components/ui/dialog";

export function AddExpenseButton({ quoteId, variant = "default" }: { quoteId?: string, variant?: "default" | "outline" }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      description: formData.get("description") as string,
      montant: parseFloat(formData.get("montant") as string),
      categorie: formData.get("categorie") as string,
      date: formData.get("date") as string,
      quote_id: quoteId || null,
    };

    startTransition(async () => {
      const result = await addExpenseAction(data);
      if (result.success) {
        toast.success("Dépense ajoutée !");
        setOpen(false);
      } else {
        toast.error("Erreur", { description: result.error });
      }
    });
  };

  const buttonStyle = variant === "default" 
    ? "bg-brand-accent text-black font-bold px-4 py-2 rounded-md hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/20" 
    : "bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-4 py-2 rounded-md transition-colors";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <button className={`flex items-center gap-2 cursor-pointer ${buttonStyle}`}>
          <Plus className="h-5 w-5" />
          {quoteId ? "Ajouter une dépense liée" : "Nouvelle Dépense"}
        </button>
      } />
      
      <DialogContent className="bg-brand-night border-white/10 text-white sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Ajouter une dépense {quoteId && "liée à ce devis"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="text-sm text-gray-400">Description</label>
            <input name="description" required placeholder="Ex: Nom de domaine" className="w-full bg-black/40 border border-white/10 rounded-md p-2 mt-1 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Montant (€)</label>
              <input name="montant" type="number" step="0.01" required placeholder="15.99" className="w-full bg-black/40 border border-white/10 rounded-md p-2 mt-1 text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Date</label>
              <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-black/40 border border-white/10 rounded-md p-2 mt-1 text-white" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400">Catégorie</label>
            <input name="categorie" required placeholder="Ex: Infra, Dev..." className="w-full bg-black/40 border border-white/10 rounded-md p-2 mt-1 text-white" />
          </div>
          <DialogFooter className="pt-4">
            <DialogClose render={<button type="button" className="px-4 py-2 text-sm text-gray-400 hover:text-white">Annuler</button>} />
            <button type="submit" disabled={isPending} className="bg-brand-accent hover:bg-brand-accent/80 text-black font-bold px-4 py-2 rounded-md disabled:opacity-50 flex items-center gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isPending ? "Ajout..." : "Ajouter"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}