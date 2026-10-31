"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/clients", label: "Clients" },
    { href: "/quotes", label: "Devis" },
  ];

  return (
    <header className="w-full border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          DevFact <span className="text-brand-accent">Flow</span>
        </Link>

        {/* Navigation Desktop (Caché sur mobile) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-text-muted hover:text-brand-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Menu Burger Mobile (Caché sur desktop) */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<button className="p-2 text-text-muted hover:text-white transition-colors" />}>
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-brand-night border-white/10 text-text-main w-62.5">
              <nav className="flex flex-col gap-6 mt-12">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)} // Ferme le menu au clic
                    className="text-lg font-medium text-text-muted hover:text-brand-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}