"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { InvoiceStatus } from "../../src/generated/prisma/client";

// 1. Changement de statut (Sécurisé)
export async function updateInvoiceStatus(invoiceId: string, newStatus: InvoiceStatus) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: session.user.id }
  });
  
  if (!invoice) throw new Error("Facture introuvable");
  if (invoice.status === "PAID") throw new Error("Une facture payée ne peut plus être modifiée.");

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: newStatus },
  });

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
}

// 2. Suppression d'une facture (Sécurisé)
export async function deleteInvoice(invoiceId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const invoice = await prisma.invoice.findFirst({ 
    where: { id: invoiceId, userId: session.user.id } 
  });

  if (!invoice) throw new Error("Facture introuvable");
  if (invoice.status === "PAID") throw new Error("Une facture payée ne peut pas être supprimée.");

  await prisma.invoice.delete({ where: { id: invoiceId } });
  revalidatePath("/invoices");
}