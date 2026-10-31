import prisma from "@/lib/prisma";
import { ClientModal } from "./client-modal";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      
      {/* En-tête : en colonne sur mobile, en ligne sur desktop */}
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
            <div key={client.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 hover:bg-white/10 transition-colors">
              <div className="flex-1">
                {/* Affichage de l'entreprise si elle existe */}
                {client.companyName && (
                  <p className="text-xs text-brand-accent font-semibold uppercase tracking-wider mb-1">
                    {client.companyName}
                  </p>
                )}
                
                {/* Nom du contact */}
                <h3 className="font-bold text-xl text-text-main">{client.name}</h3>
                <p className="text-text-muted text-sm">{client.email}</p>
              </div>
              <div className="text-sm text-brand-accent font-mono bg-brand-accent/10 px-2 py-1 rounded md:bg-transparent md:p-0">
                {client.phone || "Pas de téléphone"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}