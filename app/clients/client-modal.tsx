"use client";

import { useState, useTransition } from "react";
import { createClient } from "./actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ClientModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createClient(formData);
        toast.success("Client créé !", { description: "Le nouveau client a bien été ajouté à votre liste." });
        setOpen(false);
      } catch (error) {
        toast.error("Erreur", { description: "Impossible de créer le client." });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<button className="w-full md:w-auto bg-brand-accent text-brand-night px-4 py-2 rounded-md font-bold hover:bg-brand-accent/90 transition-colors cursor-pointer" />}>
        + Nouveau Client
      </DialogTrigger>
      
      <DialogContent className="bg-brand-night border-white/10 text-text-main sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-xl">Ajouter un nouveau client</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom de l'entreprise</label>
            <input type="text" name="companyName" className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent" placeholder="Ex: Acme Corp (Optionnel)" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nom du contact *</label>
            <input type="text" name="name" required className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent" placeholder="Ex: Jean Dupont" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input type="email" name="email" required className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent" placeholder="contact@acme.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input type="tel" name="phone" className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent" placeholder="06 12 34 56 78 (Optionnel)" />
          </div>

          <button type="submit" disabled={isPending} className="w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-night font-bold py-3 rounded-md hover:bg-brand-accent/90 transition-colors mt-2 cursor-pointer disabled:opacity-50">
            {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement...</> : "Enregistrer le client"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}