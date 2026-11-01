import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Sécurité côté serveur : si pas de session, on dégage
  if (!session?.user?.id) redirect("/");

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6 md:p-24 text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6">
        DevFact <span className="text-brand-accent">Flow</span>
      </h1>
      <p className="text-lg md:text-xl text-text-muted max-w-2xl mb-8 md:mb-10">
        L'outil de devis et facturation ultra pro.
      </p>
      <a href="/quotes/new" className="bg-brand-accent text-brand-night px-6 py-3 rounded-md font-bold hover:bg-brand-accent/90 transition-colors cursor-pointer w-full md:w-auto">
        Créer mon premier devis
      </a>
    </main>
  );
}