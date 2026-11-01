import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Download, Send } from "lucide-react";
import { notFound } from "next/navigation";
import { StatusDropdown } from "./status-dropdown";

export default async function QuoteDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      client: true,
      items: true,
    },
  });

  if (!quote) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      
      {/* Barre d'actions supérieure */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <Link href="/quotes" className="text-brand-accent hover:underline flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" /> Retour aux devis
        </Link>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-md transition-colors text-sm font-medium">
            <Download className="h-4 w-4" /> PDF
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brand-accent text-brand-night hover:bg-brand-accent/90 px-4 py-2 rounded-md transition-colors text-sm font-bold">
            <Send className="h-4 w-4" /> Envoyer
          </button>
        </div>
      </div>

      {/* La feuille du devis */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl">
        
        {/* En-tête du devis */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-8 mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Devis <span className="text-brand-accent">#{quote.number}</span>
            </h1>
            <p className="text-text-muted text-sm">
              Émis le {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
          
          <div className="text-left md:text-right">
            <StatusDropdown quoteId={quote.id} currentStatus={quote.status} />
          </div>
        </div>

        {/* Infos Client */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Facturé à</p>
          <div className="text-text-main">
            {quote.client.companyName && (
              <p className="font-bold text-lg">{quote.client.companyName}</p>
            )}
            <p className={quote.client.companyName ? "text-text-muted" : "font-bold text-lg"}>
              {quote.client.name}
            </p>
            <p className="text-sm text-text-muted mt-1">{quote.client.email}</p>
            {quote.client.phone && <p className="text-sm text-text-muted">{quote.client.phone}</p>}
          </div>
        </div>

        {/* Tableau des prestations */}
        <div className="w-full mb-8">
          <div className="hidden md:grid grid-cols-12 gap-4 border-b border-white/10 pb-3 mb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-center">Qté</div>
            <div className="col-span-2 text-right">Prix Unitaire</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="space-y-4">
            {quote.items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 border-b border-white/5 pb-4 md:pb-3 items-center">
                <div className="col-span-1 md:col-span-6 font-medium text-white">
                  {item.description}
                </div>
                <div className="col-span-1 md:col-span-2 text-left md:text-center text-sm text-text-muted">
                  <span className="md:hidden font-semibold">Qté : </span>{item.quantity}
                </div>
                <div className="col-span-1 md:col-span-2 text-left md:text-right text-sm text-text-muted">
                  <span className="md:hidden font-semibold">P.U. : </span>{item.unitPrice.toFixed(2)} €
                </div>
                <div className="col-span-1 md:col-span-2 text-left md:text-right font-mono font-bold text-white mt-1 md:mt-0">
                  {(item.quantity * item.unitPrice).toFixed(2)} €
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-end border-t border-white/10 pt-6">
          <div className="w-full md:w-1/2 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-text-muted">
              <span>Sous-total</span>
              <span>{quote.total.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10 mt-2">
              <span>Total</span>
              <span className="text-brand-accent">{quote.total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}