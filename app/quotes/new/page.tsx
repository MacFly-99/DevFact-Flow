import prisma from "@/lib/prisma";
import { QuoteForm } from "./quote-form";
import Link from "next/link";

export default async function NewQuotePage() {
  // On récupère les clients pour les afficher dans le menu déroulant
  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <Link href="/quotes" className="text-brand-accent hover:underline mb-6 inline-block text-sm">
        ← Retour aux devis
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Créer un nouveau devis</h1>

      {clients.length === 0 ? (
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
          <p className="text-text-muted mb-4">Tu dois d'abord créer un client avant de pouvoir faire un devis.</p>
          <Link href="/clients" className="bg-brand-accent text-brand-night px-4 py-2 rounded-md font-bold">
            Créer un client
          </Link>
        </div>
      ) : (
        // On passe les clients au composant client
        <QuoteForm clients={clients} />
      )}
    </div>
  );
}