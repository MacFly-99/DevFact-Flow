"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { QuoteStatus } from "../../src/generated/prisma/client";

export async function createQuote(formData: FormData) {
  const clientId = formData.get("clientId") as string;
  const itemsJson = formData.get("items") as string;
  
  const items = JSON.parse(itemsJson);

  if (!clientId || items.length === 0) {
    throw new Error("Données invalides");
  }

  const total = items.reduce((acc: number, item: any) => {
    return acc + (Number(item.quantity) * Number(item.unitPrice));
  }, 0);

  const count = await prisma.quote.count();
  const year = new Date().getFullYear();
  const quoteNumber = `DEV-${year}-${String(count + 1).padStart(3, "0")}`;

  await prisma.quote.create({
    data: {
      number: quoteNumber,
      clientId: clientId,
      total: total,
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

// 👇 La nouvelle fonction pour mettre à jour le statut
export async function updateQuoteStatus(quoteId: string, newStatus: QuoteStatus) {
  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: newStatus },
  });

  revalidatePath(`/quotes/${quoteId}`);
  revalidatePath("/quotes");
}