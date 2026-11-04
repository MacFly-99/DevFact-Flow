"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Le Schéma de validation
const ClientSchema = z.object({
  companyName: z.string().max(100, "Le nom de l'entreprise est trop long").optional(),
  name: z.string().min(1, "Le nom du contact est requis").max(100, "Le nom est trop long"),
  email: z.string().email("L'adresse email est invalide"),
  phone: z.string().max(20, "Le numéro est trop long").optional(),
});

export async function createClient(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  // 1. On extrait les données brutes
  const rawData = Object.fromEntries(formData.entries());

  // 2. On valide avec Zod
  const validatedFields = ClientSchema.safeParse(rawData);

  if (!validatedFields.success) {
    // Si la validation échoue, on renvoie la première erreur
    throw new Error(validatedFields.error.issues[0].message);
  }

  // 3. On utilise les données validées (100% sûres)
  const { companyName, name, email, phone } = validatedFields.data;

  try {
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
    return { success: true };
  } catch (error: any) {
    // Gestion de l'erreur d'unicité de l'email (si l'email existe déjà)
    if (error.code === 'P2002') {
      throw new Error("Cet email est déjà utilisé par un autre client.");
    }
    throw new Error("Impossible de créer le client.");
  }
}

export async function deleteClient(clientId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: session.user.id },
    include: { quotes: true, invoices: true }
  });

  if (!client) throw new Error("Client introuvable");

  const hasAcceptedQuote = client.quotes.some(q => q.status === "ACCEPTED");
  const hasPaidInvoice = client.invoices.some(i => i.status === "PAID");

  if (hasAcceptedQuote || hasPaidInvoice) {
    throw new Error("Impossible de supprimer ce client : il possède des devis acceptés ou des factures payées.");
  }

  await prisma.client.delete({
    where: { id: clientId },
  });

  revalidatePath("/clients");
}