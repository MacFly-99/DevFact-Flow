import prisma from "@/lib/prisma";
import { QuoteForm } from "./quote-form";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewQuotePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/login");

  // FILTRE PAR USER ID : On ne veut que les clients de cet utilisateur
  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
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
        <QuoteForm clients={clients} />
      )}
    </div>
  );
}