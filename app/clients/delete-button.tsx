"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteClient } from "./actions";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteClientButton({ clientId, clientName }: { clientId: string, clientName: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteClient(clientId);
        toast.success("Client supprimé", { description: `Le compte de ${clientName} a été supprimé.` });
        setOpen(false);
      } catch (error: any) {
        // C'est ici que l'erreur du serveur (si le client a des factures payées) sera affichée
        toast.error("Suppression impossible", { description: error.message });
        setOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={
        <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer" title="Supprimer le client">
          <Trash2 className="h-4 w-4" />
        </button>
      } />
      <AlertDialogContent className="bg-brand-night border-red-500/30 border-2 text-text-main">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">Supprimer ce client ?</AlertDialogTitle>
          <AlertDialogDescription className="text-text-muted">
            <span className="block mb-2">Êtes-vous sûr de vouloir supprimer <strong className="text-white">{clientName}</strong> ?</span>
            <span className="block text-sm">Cette action supprimera également tous ses devis et factures en cours (brouillons/envoyés).</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDelete(); }} disabled={isPending} className="bg-red-500 hover:bg-red-600 text-white font-bold">
            {isPending ? "Suppression..." : "Supprimer définitivement"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}