"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteInvoice } from "../actions";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteInvoice(invoiceId);
        toast.success("Facture supprimée.");
        router.push("/invoices");
      } catch (error: any) {
        toast.error("Erreur", { description: error.message });
        setOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={
        <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer" title="Supprimer la facture">
          <Trash2 className="h-4 w-4" />
        </button>
      } />
      <AlertDialogContent className="bg-brand-night border-red-500/30 border-2 text-text-main">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">Supprimer cette facture ?</AlertDialogTitle>
          <AlertDialogDescription className="text-text-muted">
            <span className="block mb-2">Cette action est irréversible.</span>
            <span className="block">La facture et toutes ses lignes seront définitivement supprimées de la base de données.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDelete(); }} disabled={isPending} className="bg-red-500 hover:bg-red-600 text-white font-bold">
            {isPending ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}