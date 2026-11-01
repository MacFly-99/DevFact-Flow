import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PersonalInfo } from "./personal-info";
import { PasswordForm } from "./password-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/");

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      
      {/* En-tête avec Avatar */}
      <div className="flex items-center gap-6 mb-10 border-b border-white/10 pb-8">
        <Avatar className="h-24 w-24 border-2 border-brand-accent/50">
          <AvatarFallback className="bg-brand-accent/20 text-brand-accent text-3xl font-bold">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
          <p className="text-text-muted">{user.email}</p>
          {user.role === "ADMIN" && (
            <div className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/20 inline-flex items-center gap-1 mt-3">
              <Shield className="h-3 w-3" /> Super Admin
            </div>
          )}
        </div>
      </div>

      {/* Layout 2 Colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Bloc 1 : Infos Persos (Gauche) */}
        <div>
          <PersonalInfo user={user} />
        </div>

        {/* Bloc 2 : Mot de passe (Droite) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 h-full">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-accent" /> Sécurité
          </h3>
          <p className="text-sm text-text-muted mb-6">
            Modifiez votre mot de passe ici. Si vous avez oublié votre mot de passe actuel, vous devrez passer par la procédure de récupération.
          </p>
          <PasswordForm />
        </div>

      </div>
    </div>
  );
}