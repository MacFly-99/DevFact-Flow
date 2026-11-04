import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { updateCompanySettings } from "./actions";
import { Building2, MapPin, Hash, FileText, Phone } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/");

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2">Paramètres de l'entreprise</h1>
      <p className="text-text-muted mb-8">Ces informations apparaîtront sur vos devis et factures PDF.</p>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8">
        <form action={updateCompanySettings} className="space-y-6">
          
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
              className="w-full md:w-auto bg-brand-accent text-brand-night px-8 py-3 rounded-md font-bold hover:bg-brand-accent/90 transition-colors cursor-pointer"
            >
              Enregistrer les paramètres
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}