"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { CreateQuoteSchema, QuoteStatusSchema, IdSchema } from "@/lib/validations";

export async function createQuote(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const rawData = {
    clientId: formData.get("clientId"),
    taxRate: Number(formData.get("taxRate")),
    items: JSON.parse(formData.get("items") as string),
  };

  const validatedFields = CreateQuoteSchema.safeParse(rawData);
  if (!validatedFields.success) throw new Error(validatedFields.error.issues[0].message);

  const { clientId, taxRate, items } = validatedFields.data;

  const totalHT = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const taxAmount = totalHT * (taxRate / 100);
  const totalTTC = totalHT + taxAmount;

  const count = await prisma.quote.count({ where: { userId: session.user.id } });
  const year = new Date().getFullYear();
  const quoteNumber = `DEV-${year}-${String(count + 1).padStart(3, "0")}`;

  await prisma.quote.create({
    data: {
      number: quoteNumber,
      clientId: clientId,
      total: totalHT,
      taxRate: taxRate,
      taxAmount: taxAmount,
      totalTTC: totalTTC,
      userId: session.user.id,
      items: {
        create: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
  });

  revalidatePath("/quotes");
  return { success: true };
}

export async function updateQuoteStatus(quoteId: string, newStatus: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  // Validation de l'ID et du Statut
  const validatedId = IdSchema.safeParse(quoteId);
  const validatedStatus = QuoteStatusSchema.safeParse(newStatus);
  if (!validatedId.success || !validatedStatus.success) throw new Error("Données invalides.");

  const quote = await prisma.quote.findFirst({
    where: { id: validatedId.data, userId: session.user.id }
  });
  
  if (!quote) throw new Error("Devis introuvable");
  if (quote.status === "ACCEPTED") throw new Error("Un devis accepté ne peut plus être modifié.");

  await prisma.quote.update({
    where: { id: validatedId.data },
    data: { status: validatedStatus.data },
  });

  revalidatePath(`/quotes/${quoteId}`);
  revalidatePath("/quotes");
}

export async function convertToInvoice(quoteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const validatedId = IdSchema.safeParse(quoteId);
  if (!validatedId.success) throw new Error("Identifiant invalide.");

  const existingInvoice = await prisma.invoice.findUnique({
    where: { quoteId: validatedId.data },
  });

  if (existingInvoice) {
    return { success: true, invoiceId: existingInvoice.id, message: "La facture existe déjà." };
  }

  const quote = await prisma.quote.findFirst({
    where: { id: validatedId.data, userId: session.user.id },
    include: { items: true },
  });

  if (!quote) throw new Error("Devis introuvable");
  if (quote.status !== "ACCEPTED") throw new Error("Seuls les devis acceptés peuvent être facturés.");

  const count = await prisma.invoice.count({ where: { userId: session.user.id } });
  const year = new Date().getFullYear();
  const invoiceNumber = `FAC-${year}-${String(count + 1).padStart(3, "0")}`;

  const invoice = await prisma.invoice.create({
    data: {
      number: invoiceNumber,
      clientId: quote.clientId,
      total: quote.total,
      taxRate: quote.taxRate,
      taxAmount: quote.taxAmount,
      totalTTC: quote.totalTTC,
      userId: session.user.id,
      quoteId: quote.id,
      items: {
        create: quote.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
  });

  revalidatePath("/invoices");
  revalidatePath(`/quotes/${quoteId}`);
  return { success: true, invoiceId: invoice.id };
}

export async function deleteQuote(quoteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const validatedId = IdSchema.safeParse(quoteId);
  if (!validatedId.success) throw new Error("Identifiant invalide.");

  const quote = await prisma.quote.findFirst({
    where: { id: validatedId.data, userId: session.user.id }
  });

  if (!quote) throw new Error("Devis introuvable");
  if (quote.status === "ACCEPTED") throw new Error("Un devis accepté ne peut pas être supprimé.");

  await prisma.quote.delete({ where: { id: validatedId.data } });
  revalidatePath("/quotes");
}