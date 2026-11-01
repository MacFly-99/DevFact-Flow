"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteUser } from "./actions";
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
      await deleteUser(userId);
      setOpen(false);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={
        <button className="p-2 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer" title="Supprimer l'utilisateur">
          <Trash2 className="h-4 w-4" />
        </button>
      } />
      
      <AlertDialogContent className="bg-brand-night border-white/10 text-text-main">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400 flex items-center gap-2">
            <Trash2 className="h-5 w-5" /> Supprimer l'utilisateur ?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text-muted">
            Êtes-vous sûr de vouloir supprimer <strong className="text-white">{userName}</strong> ? <br /><br />
            <span className="text-red-400 font-semibold">Attention :</span> Cette action est irréversible. Tous ses clients et tous ses devis seront définitivement supprimés de la base de données.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white cursor-pointer">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault(); // Empêche la fermeture immédiate pour laisser le temps à la transition
              handleDelete();
            }}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600 text-white font-bold cursor-pointer disabled:opacity-50"
          >
            {isPending ? "Suppression..." : "Oui, supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}