"use client";

import { useState, useTransition } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteUser } from "./actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteUserModal({ userId, userName }: { userId: string, userName: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteUser(userId);
        toast.success("Utilisateur supprimé", { description: `Le compte de ${userName} a été définitivement supprimé.` });
        setOpen(false);
      } catch (error: any) {
        toast.error("Erreur", { description: error.message || "Impossible de supprimer l'utilisateur." });
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={
        <button className="p-2 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer" title="Supprimer l'utilisateur">
          <Trash2 className="h-4 w-4" />
        </button>
      } />
      
      <AlertDialogContent className="bg-brand-night border-red-500/30 border-2 text-text-main sm:max-w-106.25">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400 flex items-center gap-2 text-xl">
            <AlertTriangle className="h-6 w-6" /> Supprimer définitivement ?
          </AlertDialogTitle>
          
          {/* 👇 On utilise des <span className="block"> au lieu de <p> et <div> */}
          <AlertDialogDescription className="text-text-muted space-y-4 pt-2">
            <span className="block">
              Êtes-vous sûr de vouloir supprimer le compte de <strong className="text-white text-base">{userName}</strong> ?
            </span>
            <span className="block bg-red-500/10 border border-red-500/20 p-3 rounded-md text-red-300 text-sm mt-4">
              <strong>Attention :</strong> Cette action est irréversible. Tous ses clients, ses devis et ses factures seront définitivement supprimés de la base de données.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white cursor-pointer">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault(); 
              handleDelete();
            }}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600 text-white font-bold cursor-pointer disabled:opacity-50"
          >
            {isPending ? "Suppression..." : "Oui, supprimer définitivement"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}