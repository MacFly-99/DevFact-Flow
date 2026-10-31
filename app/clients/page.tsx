import prisma from "@/lib/prisma";
import { ClientModal } from "./client-modal";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes Clients</h1>
        
        <ClientModal />
        
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
          <p className="text-text-muted text-lg mb-4">Tu n'as pas encore de clients.</p>
          <p className="text-sm text-text-muted">Clique sur "Nouveau Client" pour commencer !</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <div key={client.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex justify-between items-center hover:bg-white/10 transition-colors">
              <div>
                <h3 className="font-bold text-xl text-text-main">{client.name}</h3>
                <p className="text-text-muted">{client.email || "Pas d'email"}</p>
              </div>
              <div className="text-sm text-brand-accent font-mono">
                {client.phone || "Pas de téléphone"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}