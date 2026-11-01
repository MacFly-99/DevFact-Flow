import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Shield, Users, FileText, Briefcase } from "lucide-react";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  // @ts-ignore
  if (session?.user?.role !== "ADMIN") redirect("/dashboard");

  // On récupère TOUS les utilisateurs et leurs stats
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { clients: true, quotes: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  const totalClients = users.reduce((acc, user) => acc + user._count.clients, 0);
  const totalQuotes = users.reduce((acc, user) => acc + user._count.quotes, 0);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
        <Shield className="h-8 w-8 text-brand-accent" />
        <h1 className="text-3xl font-bold">Panneau Super Admin</h1>
      </div>

      {/* Stats Globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-bold">{user.name || "Sans nom"}</p>
                    <p className="text-sm text-text-muted">{user.email}</p>
                  </td>
                  <td className="p-4 text-center font-mono">{user._count.clients}</td>
                  <td className="p-4 text-center font-mono">{user._count.quotes}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      // @ts-ignore
                      user.role === "ADMIN" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {/* @ts-ignore */}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-right text-sm text-text-muted">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}