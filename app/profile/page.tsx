import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/");

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 border-2 border-brand-accent/50 mb-4">
          <AvatarFallback className="bg-brand-accent/20 text-brand-accent text-3xl font-bold">
            {getInitials(session.user.name)}
          </AvatarFallback>
        </Avatar>
        
        <h2 className="text-2xl font-bold text-white">{session.user.name}</h2>
        <p className="text-text-muted mb-6">{session.user.email}</p>
        
        <div className="bg-black/30 px-4 py-2 rounded-full text-sm font-mono border border-white/10">
          Rôle : <span className="text-brand-accent font-bold">{(session.user as any).role}</span>
        </div>
      </div>
    </div>
  );
}