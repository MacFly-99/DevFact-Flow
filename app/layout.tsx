import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
        <div className="bg-geometric-pattern min-h-screen w-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}