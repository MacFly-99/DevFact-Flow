import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "DevFact Flow",
  description: "Outil de devis et facturation",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={cn("font-sans", inter.variable, "dark")}>
      <body className="antialiased">
        {/* Le conteneur principal prend toute la hauteur de l'écran */}
        <div className="bg-geometric-pattern min-h-screen w-full flex flex-col">
          <Header />
          
          {/* La balise main avec "flex-1" va s'étirer pour pousser le footer en bas */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          
          <Footer />
        </div>
      </body>
    </html>
  );
}