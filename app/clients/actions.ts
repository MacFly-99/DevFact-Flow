"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const ClientSchema = z.object({
  companyName: z.string().max(100).optional(),
  name: z.string().min(1, "Le nom du contact est requis").max(100),
  email: z.string().email("L'adresse email est invalide"),
  phone: z.string().max(20).optional(),
});

export async function createClient(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = ClientSchema.safeParse(rawData);

  if (!validatedFields.success) throw new Error(validatedFields.error.issues[0].message);

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
    revalidateTag("clients", "default");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') throw new Error("Cet email est déjà utilisé par un autre client.");
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

  await prisma.client.delete({ where: { id: clientId } });
  
  revalidatePath("/clients");
  revalidateTag("clients", "default");
}