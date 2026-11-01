import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Download, Send } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { InvoiceStatusDropdown } from "./status-dropdown";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function InvoiceDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/");

  const invoice = await prisma.invoice.findFirst({
    where: { 
      id: id,
      userId: session.user.id 
    },
    include: {
      client: true,
      items: true,
    },
  });

  if (!invoice) {
    notFound();
  }

  const dueDate = new Date(invoice.createdAt);
  dueDate.setDate(dueDate.getDate() + 30);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <Link href="/invoices" className="text-brand-accent hover:underline flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" /> Retour aux factures
        </Link>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-md transition-colors text-sm font-medium">
            <Download className="h-4 w-4" /> PDF
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brand-accent text-brand-night hover:bg-brand-accent/90 px-4 py-2 rounded-md transition-colors text-sm font-bold">
            <Send className="h-4 w-4" /> Envoyer par email
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-8 mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Facture <span className="text-brand-accent">#{invoice.number}</span>
            </h1>
            <p className="text-text-muted text-sm">
              Émise le {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}
            </p>
            <p className="text-text-muted text-sm font-medium mt-1">
              Échéance : {dueDate.toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="text-left md:text-right">
            <InvoiceStatusDropdown invoiceId={invoice.id} currentStatus={invoice.status} />
          </div>
        </div>

        <div className="mb-10">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Facturé à</p>
          <div className="text-text-main">
            {invoice.client.companyName && (
              <p className="font-bold text-lg">{invoice.client.companyName}</p>
            )}
            <p className={invoice.client.companyName ? "text-text-muted" : "font-bold text-lg"}>
              {invoice.client.name}
            </p>
            <p className="text-sm text-text-muted mt-1">{invoice.client.email}</p>
            {invoice.client.phone && <p className="text-sm text-text-muted">{invoice.client.phone}</p>}
          </div>
        </div>

        <div className="w-full mb-8">
          <div className="hidden md:grid grid-cols-12 gap-4 border-b border-white/10 pb-3 mb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-center">Qté</div>
            <div className="col-span-2 text-right">Prix Unitaire</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="space-y-4">
            {invoice.items.map((item) => (
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

        <div className="flex justify-end border-t border-white/10 pt-6">
          <div className="w-full md:w-1/2 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-text-muted">
              <span>Sous-total</span>
              <span>{invoice.total.toFixed(2)} €</span>
            </div>
            <p className="text-xs text-text-muted mt-2">Payable sous 30 jours.</p>
            <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10 mt-2">
              <span>Total à payer</span>
              <span className="text-brand-accent">{invoice.total.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}