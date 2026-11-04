"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const companyName = formData.get("companyName") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!name || !email) {
    throw new Error("Le nom et l'email sont obligatoires");
  }

  await prisma.client.create({
    data: {
      companyName: companyName || null,
      name: name,
      email: email,
      phone: phone || null,
      userId: session.user.id,
    },
  });

  revalidatePath("/clients");
}

export async function deleteClient(clientId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  // 1. On récupère le client avec ses devis et factures
  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: session.user.id },
    include: { quotes: true, invoices: true }
  });

  if (!client) throw new Error("Client introuvable");

  // 2. On vérifie les règles métier
  const hasAcceptedQuote = client.quotes.some(q => q.status === "ACCEPTED");
  const hasPaidInvoice = client.invoices.some(i => i.status === "PAID");

  if (hasAcceptedQuote || hasPaidInvoice) {
    throw new Error("Impossible de supprimer ce client : il possède des devis acceptés ou des factures payées. L'historique comptable doit être conservé.");
  }

  // 3. On supprime (les devis/factures brouillons seront supprimés en cascade)
  await prisma.client.delete({
    where: { id: clientId },
  });

  revalidatePath("/clients");
}