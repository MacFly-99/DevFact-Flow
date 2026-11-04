import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { SettingsForm } from "./settings-form";

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
        {/* 👇 On utilise notre composant client */}
        <SettingsForm user={user} />
      </div>
    </div>
  );
}