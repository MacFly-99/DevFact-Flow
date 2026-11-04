"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Mail, Phone, FileText, FileCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteClientButton } from "./delete-button";

type ClientCardProps = {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    companyName: string | null;
    _count: { quotes: number; invoices: number };
  };
};

export function ClientCard({ client }: ClientCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Carte cliquable */}
      <div 
        onClick={() => setOpen(true)}
        className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 hover:bg-white/10 hover:border-brand-accent/50 transition-all duration-200 group cursor-pointer"
      >
        <div className="flex-1">
          {client.companyName && (
            <p className="text-xs text-brand-accent font-semibold uppercase tracking-wider mb-1 group-hover:text-brand-accent/80 transition-colors">
              {client.companyName}
            </p>
          )}
          <h3 className="font-bold text-xl text-text-main">{client.name}</h3>
          <p className="text-text-muted text-sm">{client.email}</p>
        </div>
        <div className="text-sm text-brand-accent font-mono bg-brand-accent/10 px-2 py-1 rounded md:bg-transparent md:p-0">
          {client.phone || "Pas de téléphone"}
        </div>
      </div>

      {/* Modale de détails */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-brand-night border-white/10 text-text-main sm:max-w-106.25">
          
          {/* 👇 Ajout de pr-8 ici pour éviter le chevauchement avec la croix de fermeture */}
          <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/10 pr-8">
            <DialogTitle className="text-2xl">{client.companyName || client.name}</DialogTitle>
            
            <DeleteClientButton clientId={client.id} clientName={client.name} />
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-black/20 p-4 rounded-lg border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted">Entreprise</p>
                  <p className="font-medium">{client.companyName || "Non renseignée"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted">Téléphone</p>
                  <p className="font-medium">{client.phone || "Non renseigné"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/quotes" 
                className="bg-white/5 p-3 rounded-lg text-center border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all group block"
              >
                <FileText className="h-5 w-5 text-purple-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs text-text-muted">Devis</p>
                <p className="text-xl font-bold">{client._count.quotes}</p>
              </Link>

              <Link 
                href="/invoices" 
                className="bg-white/5 p-3 rounded-lg text-center border border-white/5 hover:bg-white/10 hover:border-orange-500/30 transition-all group block"
              >
                <FileCheck className="h-5 w-5 text-orange-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs text-text-muted">Factures</p>
                <p className="text-xl font-bold">{client._count.invoices}</p>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}