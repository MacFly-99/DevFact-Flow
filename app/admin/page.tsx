import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Shield, Users, FileText, Briefcase, Euro } from "lucide-react";
import { UserRow } from "./user-row";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if ((session?.user as any)?.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    include: {
      _count: { select: { clients: true, quotes: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  const totalClients = users.reduce((acc, user) => acc + user._count.clients, 0);
  const totalQuotes = users.reduce((acc, user) => acc + user._count.quotes, 0);

  // Calcul du Chiffre d'Affaires Global (uniquement les devis acceptés)
  const revenueData = await prisma.quote.aggregate({
    where: { status: "ACCEPTED" },
    _sum: { total: true }
  });
  const totalRevenue = revenueData._sum.total || 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
        <Shield className="h-8 w-8 text-amber-400" />
        <h1 className="text-3xl font-bold">Panneau Super Admin</h1>
      </div>

      {/* Stats Globales (4 cartes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center gap-4">
          <Users className="h-8 w-8 text-brand-accent" />
          <div>
            <p className="text-text-muted text-sm">Utilisateurs</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center gap-4">
          <Briefcase className="h-8 w-8 text-brand-accent" />
          <div>
            <p className="text-text-muted text-sm">Clients Globaux</p>
            <p className="text-2xl font-bold">{totalClients}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center gap-4">
          <FileText className="h-8 w-8 text-brand-accent" />
          <div>
            <p className="text-text-muted text-sm">Devis Globaux</p>
            <p className="text-2xl font-bold">{totalQuotes}</p>
          </div>
        </div>
        
        {/* Carte CA Global */}
        <div className="bg-linear-to-br from-green-500/20 to-green-500/5 border border-green-500/30 p-6 rounded-xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Euro className="h-16 w-16 text-green-400" />
          </div>
          <div className="p-3 bg-green-500/20 rounded-lg z-10">
            <Euro className="h-6 w-6 text-green-400" />
          </div>
          <div className="z-10">
            <p className="text-green-400 text-sm font-medium">CA Global (Accepté)</p>
            <p className="text-2xl font-bold text-white">{totalRevenue.toFixed(2)} €</p>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-black/20">
          <h2 className="font-bold text-lg">Tous les utilisateurs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-sm text-text-muted">
                <th className="p-4 font-medium">Nom / Email</th>
                <th className="p-4 font-medium text-center">Clients</th>
                <th className="p-4 font-medium text-center">Devis</th>
                <th className="p-4 font-medium">Rôle</th>
                <th className="p-4 font-medium text-right">Inscrit le</th>
                <th className="p-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow 
                  key={user.id} 
                  user={user} 
                  isCurrentUser={session?.user?.id === user.id} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}