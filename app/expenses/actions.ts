"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addExpenseAction(data: any) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  try {
    await prisma.expense.create({
      data: {
        description: data.description,
        montant: data.montant,
        categorie: data.categorie,
        date: new Date(data.date),
        userId: session.user.id,
        quoteId: data.quote_id || null,
      }
    });

    revalidatePath("/expenses");
    if (data.quote_id) {
      revalidatePath(`/quotes/${data.quote_id}`);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateExpenseAction(id: string, data: any, quoteId?: string | null) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  try {
    // VÉRIFICATION DE SÉCURITÉ
    if (quoteId) {
      const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
      if (quote?.status === "ACCEPTED") {
        return { success: false, error: "Impossible de modifier une dépense liée à un devis accepté." };
      }
    }

    await prisma.expense.update({
      where: { id: id },
      data: {
        description: data.description,
        montant: data.montant,
        categorie: data.categorie,
        date: new Date(data.date),
      }
    });

    revalidatePath("/expenses");
    if (quoteId) revalidatePath(`/quotes/${quoteId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteExpenseAction(id: string, quoteId?: string | null) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  try {
    // VÉRIFICATION DE SÉCURITÉ
    if (quoteId) {
      const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
      if (quote?.status === "ACCEPTED") {
        return { success: false, error: "Impossible de supprimer une dépense liée à un devis accepté." };
      }
    }

    await prisma.expense.delete({ where: { id: id } });

    revalidatePath("/expenses");
    if (quoteId) revalidatePath(`/quotes/${quoteId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}