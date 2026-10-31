"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createQuote(formData: FormData) {
  const clientId = formData.get("clientId") as string;
  const itemsJson = formData.get("items") as string;
  
  // On récupère le tableau d'articles envoyé en JSON par le formulaire
  const items = JSON.parse(itemsJson);

  if (!clientId || items.length === 0) {
    throw new Error("Données invalides");
  }

  // Calcul du total côté serveur (sécurité)
  const total = items.reduce((acc: number, item: any) => {
    return acc + (Number(item.quantity) * Number(item.unitPrice));
  }, 0);

  // Génération d'un numéro de devis unique (Ex: DEV-2026-001)
  const count = await prisma.quote.count();
  const year = new Date().getFullYear();
  const quoteNumber = `DEV-${year}-${String(count + 1).padStart(3, "0")}`;

  // On crée le devis et ses lignes en une seule fois grâce à Prisma
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