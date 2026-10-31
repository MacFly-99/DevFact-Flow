"use client";

import { useState } from "react";
import { createQuote } from "../actions";
import { Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Client = { id: string; name: string };
type Item = { description: string; quantity: number; unitPrice: number };

export function QuoteForm({ clients }: { clients: Client[] }) {
  const [items, setItems] = useState<Item[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const total = items.reduce((acc, item) => {
    return acc + (Number(item.quantity) * Number(item.unitPrice));
  }, 0);

  async function onSubmit(formData: FormData) {
    formData.append("items", JSON.stringify(items));
    await createQuote(formData);
  }

  return (
    <form action={onSubmit} className="space-y-8 bg-white/5 p-4 md:p-8 rounded-xl border border-white/10">
      
      {/* SÉLECTION DU CLIENT */}
      <div className="max-w-md">
        <label htmlFor="clientId" className="block text-sm font-medium mb-2 text-text-main">
          Client *
        </label>
        
        <Select 
          name="clientId" 
          required
          items={clients.map(c => ({ value: c.id, label: c.name }))}
        >
          <SelectTrigger className="w-full bg-black/50 border-white/20 text-white focus:ring-brand-accent h-11 transition-colors hover:border-white/40">
            <SelectValue placeholder="Sélectionnez un client..." />
          </SelectTrigger>
          
          <SelectContent 
            alignItemWithTrigger={false}
            side="bottom"
            sideOffset={4}
            className="bg-[#151c2e] border border-white/10 text-text-main shadow-2xl rounded-lg max-h-60"
          >
            {clients.map((client) => (
              <SelectItem 
                key={client.id} 
                value={client.id} 
                className="py-3 px-4 focus:bg-brand-accent/15 focus:text-brand-accent cursor-pointer rounded-md transition-colors"
              >
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
      </div>

      {/* LIGNES D'ARTICLES */}
      <div className="space-y-2">
        
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
          <h3 className="text-lg font-bold">Détail des prestations</h3>
          <button
            type="button"
            onClick={addItem}
            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Ajouter une ligne
          </button>
        </div>

        {/* En-têtes des colonnes (Alignement corrigé) */}
        <div className="hidden md:grid grid-cols-12 gap-3 mb-2 px-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
          <div className="col-span-5 text-left">Description</div>
          <div className="col-span-2 text-center">Quantité</div>
          <div className="col-span-3 text-right pr-8">Prix Unitaire</div>
          <div className="col-span-2 text-right">Total Ligne</div>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-black/20 p-3 rounded-lg border border-white/5">
            
            {/* Description */}
            <div className="col-span-1 md:col-span-5 w-full">
              <label className="md:hidden text-xs text-text-muted mb-1 block">Description</label>
              <input
                type="text"
                placeholder="Ex: Création de site web"
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                required
                className="w-full bg-transparent border border-white/20 rounded-md p-2 text-sm text-white focus:outline-none focus:border-brand-accent"
              />
            </div>
            
            {/* Quantité (centré) */}
            <div className="col-span-1 md:col-span-2 w-full">
              <label className="md:hidden text-xs text-text-muted mb-1 block">Quantité</label>
              <input
                type="number"
                min="1"
                placeholder="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                required
                className="w-full bg-transparent border border-white/20 rounded-md p-2 text-sm text-white focus:outline-none focus:border-brand-accent text-center"
              />
            </div>

            {/* Prix Unitaire (Aligné à droite) */}
            <div className="col-span-1 md:col-span-3 w-full relative">
              <label className="md:hidden text-xs text-text-muted mb-1 block">Prix Unitaire</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, "unitPrice", Number(e.target.value))}
                required
                className="w-full bg-transparent border border-white/20 rounded-md p-2 pr-8 text-sm text-white focus:outline-none focus:border-brand-accent text-right"
              />
              <span className="absolute right-3 top-9.5 md:top-1/2 md:-translate-y-1/2 text-text-muted text-sm">€</span>
            </div>

            {/* Total ligne et bouton supprimer */}
            <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center gap-4 mt-2 md:mt-0 pr-2">
              <span className="md:hidden text-xs text-text-muted">Total :</span>
              <div className="text-right font-mono text-sm text-brand-accent font-bold">
                {(item.quantity * item.unitPrice).toFixed(2)} €
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                className="p-1.5 text-text-muted hover:text-red-400 disabled:opacity-30 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* TOTAL GÉNÉRAL ET SOUMISSION */}
      <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xl font-bold">
          Total du devis : <span className="text-brand-accent font-mono text-2xl">{total.toFixed(2)} €</span>
        </div>
        
        <button
          type="submit"
          className="w-full md:w-auto bg-brand-accent text-brand-night px-8 py-3 rounded-md font-bold hover:bg-brand-accent/90 transition-colors cursor-pointer"
        >
          Enregistrer le devis
        </button>
      </div>
    </form>
  );
}