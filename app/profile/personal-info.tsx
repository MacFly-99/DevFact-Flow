"use client";

import { useState } from "react";
import { updateProfile } from "./actions";
import { User as UserIcon, Building2, Phone, Pencil, X } from "lucide-react";

type UserData = {
  name: string | null;
  email: string;
  companyName: string | null;
  phone: string | null;
};

export function PersonalInfo({ user }: { user: UserData }) {
  const [isEditing, setIsEditing] = useState(false);

  // Fonction pour soumettre le formulaire et repasser en mode lecture
  async function handleSubmit(formData: FormData) {
    await updateProfile(formData);
    setIsEditing(false); 
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 h-full">
      
      {/* En-tête du bloc */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-brand-accent" /> Informations personnelles
        </h3>
        
        {/* Bouton Modifier / Annuler */}
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            <Pencil className="h-4 w-4" /> Modifier
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" /> Annuler
          </button>
        )}
      </div>

      {/* MODE LECTURE */}
      {!isEditing && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Nom complet</p>
            <p className="text-lg font-medium">{user.name || "Non renseigné"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Email</p>
            <p className="text-lg text-text-muted">{user.email}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Entreprise
              </p>
              <p className="text-md">{user.companyName || "Non renseignée"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                <Phone className="h-4 w-4" /> Téléphone
              </p>
              <p className="text-md">{user.phone || "Non renseigné"}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODE ÉDITION */}
      {isEditing && (
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet</label>
            <input
              type="text" name="name" defaultValue={user.name || ""} required
              className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Entreprise</label>
              <input
                type="text" name="companyName" defaultValue={user.companyName || ""}
                className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
                placeholder="Ex: Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <input
                type="tel" name="phone" defaultValue={user.phone || ""}
                className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-brand-accent text-brand-night px-6 py-3 rounded-md font-bold hover:bg-brand-accent/90 transition-colors cursor-pointer"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      )}
    </div>
  );
}