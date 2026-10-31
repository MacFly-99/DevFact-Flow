// app/clients/client-modal.tsx
"use client";

import { useState } from "react";
import { createClient } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ClientModal() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createClient(formData);
    setOpen(false);
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
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nom de l'entreprise / du client *
            </label>
            <input 
              type="text" name="name" id="name" required
              className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="Ex: Acme Corp"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input 
              type="email" name="email" id="email" 
              className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="contact@acme.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Téléphone
            </label>
            <input 
              type="tel" name="phone" id="phone" 
              className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="06 12 34 56 78"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-accent text-brand-night font-bold py-3 rounded-md hover:bg-brand-accent/90 transition-colors mt-2"
          >
            Enregistrer le client
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}