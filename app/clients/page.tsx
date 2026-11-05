import prisma from "@/lib/prisma";
import { ClientModal } from "./client-modal";
import { ClientCard } from "./client-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";

// 👇 Fonction cachée pour récupérer les clients
const getCachedClients = unstable_cache(
  async (userId: string) => {
    return prisma.client.findMany({
      where: { userId },
      select: {
        id: true, name: true, email: true, phone: true, companyName: true,
        _count: { select: { quotes: true, invoices: true } }
      },
      orderBy: { createdAt: "desc" },
    });
  },
  ['clients-list'],
  { revalidate: 60, tags: ['clients'] } // Cache invalidé si 'clients' change
);

export default async function ClientsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/login");

  // Appel de la fonction cachée
  const clients = await getCachedClients(session.user.id);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Mes Clients</h1>
        <div className="w-full md:w-auto">
          <ClientModal />
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
          <p className="text-text-muted text-lg mb-4">Tu n'as pas encore de clients.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}