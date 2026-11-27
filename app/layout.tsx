import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL('https://devfact-flow.vercel.app'),
  title: {
    default: "DevFact Flow | Gestion de devis et facturation",
    template: "%s | DevFact Flow"
  },
  description: "L'outil SaaS tout-en-un pour gérer vos clients, créer vos devis, facturer et suivre vos dépenses en toute simplicité.",
  keywords: ["devis", "facturation", "gestion clients", "SaaS", "freelance", "TVA"],
  authors: [{ name: "DevFact Flow" }],
  creator: "DevFact Flow",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://devfact-flow.vercel.app",
    title: "DevFact Flow | Gestion de devis et facturation",
    description: "L'outil SaaS tout-en-un pour gérer vos clients, créer vos devis, facturer et suivre vos dépenses.",
    siteName: "DevFact Flow",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFact Flow | Gestion de devis et facturation",
    description: "L'outil SaaS tout-en-un pour gérer vos clients, créer vos devis, facturer et suivre vos dépenses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={cn("font-sans", inter.variable, "dark")}>
      <body className="antialiased">
        <div className="bg-geometric-pattern min-h-screen w-full flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}