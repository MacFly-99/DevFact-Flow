"use client";

import { useState } from "react";
import { Eye, Building2, Phone, Shield } from "lucide-react";
import { DeleteUserModal } from "./delete-user-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// On type les données reçues depuis la page serveur
type UserRowProps = {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    companyName: string | null;
    phone: string | null;
    createdAt: Date;
    _count: { clients: number; quotes: number };
  };
  isCurrentUser: boolean;
};

export function UserRow({ user, isCurrentUser }: UserRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Carte des utilisateurs cliquable */}
      <tr 
        onClick={() => setOpen(true)}
        className="border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
      >
        <td className="p-4">
          <p className="font-bold group-hover:text-brand-accent transition-colors">
            {user.name || "Sans nom"}
          </p>
          <p className="text-sm text-text-muted">{user.email}</p>
        </td>
        <td className="p-4 text-center font-mono">{user._count.clients}</td>
        <td className="p-4 text-center font-mono">{user._count.quotes}</td>
        <td className="p-4">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-bold",
            user.role === "ADMIN" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
          )}>
            {user.role}
          </span>
        </td>
        <td className="p-4 text-right text-sm text-text-muted">
          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
        </td>
        
        {/* Cellule Actions avec stopPropagation pour ne pas déclencher le clic de la ligne */}
        <td className="p-4 flex justify-center items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setOpen(true)}
            className="p-2 text-text-muted hover:text-brand-accent hover:bg-brand-accent/10 rounded-md transition-colors cursor-pointer" 
            title="Voir les détails"
          >
            <Eye className="h-4 w-4" />
          </button>
          
          {!isCurrentUser && (
            <DeleteUserModal userId={user.id} userName={user.name || user.email} />
          )}
        </td>
      </tr>

      {/* La Modale de Détails */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-brand-night border-white/10 text-text-main sm:max-w-125">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              {user.name}
              {user.role === "ADMIN" && <Shield className="h-5 w-5 text-amber-400" />}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="flex justify-between items-center bg-black/20 p-4 rounded-lg border border-white/5">
              <div>
                <p className="text-xs text-text-muted mb-1">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted mb-1">Inscrit le</p>
                <p className="font-medium">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 p-3 rounded-lg text-center border border-white/5">
                <p className="text-text-muted text-xs mb-1">Clients</p>
                <p className="text-xl font-bold">{user._count.clients}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center border border-white/5">
                <p className="text-text-muted text-xs mb-1">Devis</p>
                <p className="text-xl font-bold">{user._count.quotes}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center border border-white/5">
                <p className="text-text-muted text-xs mb-1">Rôle</p>
                <p className="text-sm font-bold text-amber-400 mt-1">{user.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 bg-black/20 p-4 rounded-lg border border-white/5">
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Entreprise
                </p>
                <p>{user.companyName || "Non renseignée"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Téléphone
                </p>
                <p>{user.phone || "Non renseigné"}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}