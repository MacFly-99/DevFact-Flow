"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation"; // 👈 Import du router
import { updateCompanySettings } from "./actions";
import { toast } from "sonner";
import { Building2, MapPin, Hash, FileText, Phone, Loader2 } from "lucide-react";

type UserData = {
  companyName: string | null;
  companyAddress: string | null;
  companySiret: string | null;
  companyVat: string | null;
  phone: string | null;
};

export function SettingsForm({ user }: { user: UserData }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateCompanySettings(formData);
        
        toast.success("Paramètres enregistrés !", {
          description: "Vos informations d'entreprise ont bien été mises à jour.",
        });
        
        router.push("/dashboard");
        router.refresh(); // Pour s'assurer que les données du dashboard sont à jour
        
      } catch (error) {
        toast.error("Erreur", {
          description: "Impossible d'enregistrer les paramètres.",
        });
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      
      <div>
        <label className="block text-sm font-medium mb-2 items-center gap-2">
          <Building2 className="h-4 w-4 text-brand-accent" /> Nom de l'entreprise
        </label>
        <input
          type="text" name="companyName" defaultValue={user.companyName || ""}
          className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
          placeholder="Ex: Acme Corp"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 items-center gap-2">
          <MapPin className="h-4 w-4 text-brand-accent" /> Adresse complète
        </label>
        <textarea
          name="companyAddress" defaultValue={user.companyAddress || ""} rows={3}
          className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent resize-none"
          placeholder="Ex: 123 Rue de la Paix, 75000 Paris, France"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 items-center gap-2">
            <Hash className="h-4 w-4 text-brand-accent" /> SIRET
          </label>
          <input
            type="text" name="companySiret" defaultValue={user.companySiret || ""}
            className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
            placeholder="Ex: 123 456 789 00012"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 items-center gap-2">
            <FileText className="h-4 w-4 text-brand-accent" /> N° TVA Intracommunautaire
          </label>
          <input
            type="text" name="companyVat" defaultValue={user.companyVat || ""}
            className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
            placeholder="Ex: FR 12 345678901"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 items-center gap-2">
          <Phone className="h-4 w-4 text-brand-accent" /> Téléphone
        </label>
        <input
          type="tel" name="phone" defaultValue={user.phone || ""}
          className="w-full bg-black/50 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-brand-accent"
          placeholder="Ex: 01 23 45 67 89"
        />
      </div>

      <div className="pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-accent text-brand-night px-8 py-3 rounded-md font-bold hover:bg-brand-accent/90 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Enregistrement...</>
          ) : (
            "Enregistrer les paramètres"
          )}
        </button>
      </div>

    </form>
  );
}