"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { QuoteStatus } from "../../src/generated/prisma/client";

export async function createQuote(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const clientId = formData.get("clientId") as string;
  const itemsJson = formData.get("items") as string;
  const items = JSON.parse(itemsJson);

  if (!clientId || items.length === 0) {
    throw new Error("Données invalides");
  }

  const total = items.reduce((acc: number, item: any) => {
    return acc + (Number(item.quantity) * Number(item.unitPrice));
  }, 0);

  const count = await prisma.quote.count({ where: { userId: session.user.id } });
  const year = new Date().getFullYear();
  const quoteNumber = `DEV-${year}-${String(count + 1).padStart(3, "0")}`;

  await prisma.quote.create({
    data: {
      number: quoteNumber,
      clientId: clientId,
      total: total,
      userId: session.user.id,
      items: {
        create: items.map((item: any) => ({
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      },
    },
  });

  revalidatePath("/quotes");
  redirect("/quotes");
}

export async function updateQuoteStatus(quoteId: string, newStatus: QuoteStatus) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const quote = await prisma.quote.findFirst({
    where: { id: quoteId, userId: session.user.id }
  });
  if (!quote) throw new Error("Devis introuvable");

  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: newStatus },
  });

  revalidatePath(`/quotes/${quoteId}`);
  revalidatePath("/quotes");
}

export async function convertToInvoice(quoteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const existingInvoice = await prisma.invoice.findUnique({
    where: { quoteId: quoteId },
  });

  if (existingInvoice) {
    redirect(`/invoices/${existingInvoice.id}`);
  }

  const quote = await prisma.quote.findFirst({
    where: { id: quoteId, userId: session.user.id },
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
  
  redirect(`/invoices/${invoice.id}`);
}