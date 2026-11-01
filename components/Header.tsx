"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, LogOut, User, Shield } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "ADMIN";

  const handleSignOut = async () => {
    await signOut();
    router.push("/"); 
  };

  const links = [
    { href: "/clients", label: "Clients" },
    { href: "/quotes", label: "Devis" },
  ];

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <header className="w-full border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Logo (à gauche) */}
        <Link href={session ? "/dashboard" : "/"} className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          DevFact <span className="text-brand-accent">Flow</span>
        </Link>

        {/* Navigation + Profil (à droite) */}
        {session && (
          <div className="hidden md:flex items-center gap-6">
            
            {/* Les liens de navigation */}
            <nav className="flex items-center gap-6 text-sm font-medium">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-text-muted hover:text-brand-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Lien Admin */}
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-500/20"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>

            {/* Séparateur */}
            <div className="w-px h-6 bg-white/10"></div>

            {/* Menu Profil */}
            <DropdownMenu>
              <DropdownMenuTrigger render={<button className="flex items-center gap-3 focus:outline-none cursor-pointer hover:opacity-80 transition-opacity" />}>
                <div className="text-right hidden md:block max-w-37.5">
                  <p className="text-sm font-bold text-white leading-none truncate">{session.user.name}</p>
                  <p className="text-xs text-text-muted mt-1 truncate">{session.user.email}</p>
                </div>
                <Avatar className="h-9 w-9 border border-white/20">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                  <AvatarFallback className="bg-brand-accent/20 text-brand-accent font-bold">
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 bg-[#151c2e] border-white/10 text-text-main">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none truncate">{session.user.name}</p>
                      <p className="text-xs leading-none text-text-muted truncate">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuItem 
                    render={<Link href="/profile" />} 
                    className="cursor-pointer focus:bg-white/10 mt-1"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon profil</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator className="bg-white/10" />
                
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* MENU MOBILE */}
        <div className="md:hidden flex items-center gap-4">
          {session && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger render={<button className="p-2 text-text-muted hover:text-white transition-colors cursor-pointer" />}>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-brand-night border-white/10 text-text-main w-70">
                <div className="flex items-center gap-3 mt-8 mb-6 pb-6 border-b border-white/10">
                  <Avatar className="h-10 w-10 border border-white/20">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                    <AvatarFallback className="bg-brand-accent/20 text-brand-accent font-bold">
                      {getInitials(session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-45">
                    <p className="font-bold text-white truncate">{session.user.name}</p>
                    <p className="text-xs text-text-muted truncate">{session.user.email}</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-text-muted hover:text-brand-accent transition-colors px-2 py-2"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-amber-400 hover:text-amber-300 transition-colors px-2 py-2 flex items-center gap-2"
                    >
                      <Shield className="h-5 w-5" />
                      Panneau Admin
                    </Link>
                  )}
                  
                  <div className="h-px w-full bg-white/10 my-2"></div>
                  
                  <button 
                    onClick={() => { setOpen(false); handleSignOut(); }}
                    className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-all duration-200 p-2 rounded-md text-lg font-medium w-full text-left cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    Déconnexion
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>

      </div>
    </header>
  );
}