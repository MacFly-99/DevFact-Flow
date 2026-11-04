"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { InvoiceStatusSchema, IdSchema } from "@/lib/validations";

export async function updateInvoiceStatus(invoiceId: string, newStatus: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const validatedId = IdSchema.safeParse(invoiceId);
  const validatedStatus = InvoiceStatusSchema.safeParse(newStatus);
  if (!validatedId.success || !validatedStatus.success) throw new Error("Données invalides.");

  const invoice = await prisma.invoice.findFirst({
    where: { id: validatedId.data, userId: session.user.id }
  });
  
  if (!invoice) throw new Error("Facture introuvable");
  if (invoice.status === "PAID") throw new Error("Une facture payée ne peut plus être modifiée.");

  await prisma.invoice.update({
    where: { id: validatedId.data },
    data: { status: validatedStatus.data },
  });

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
}

export async function deleteInvoice(invoiceId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const validatedId = IdSchema.safeParse(invoiceId);
  if (!validatedId.success) throw new Error("Identifiant invalide.");

  const invoice = await prisma.invoice.findFirst({ 
    where: { id: validatedId.data, userId: session.user.id } 
  });

  if (!invoice) throw new Error("Facture introuvable");
  if (invoice.status === "PAID") throw new Error("Une facture payée ne peut pas être supprimée.");

  await prisma.invoice.delete({ where: { id: validatedId.data } });
  revalidatePath("/invoices");
}