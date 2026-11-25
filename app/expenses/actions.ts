"use server";

import { createTransaction, updateTransaction, deleteTransaction } from "@/lib/devspend";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function addExpenseAction(data: any) {
  try {
    await createTransaction(data);
    revalidatePath("/expenses");
    // Si c'est lié à un devis, on rafraîchit aussi la page du devis
    if (data.quote_id) {
      revalidatePath(`/quotes/${data.quote_id}`);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateExpenseAction(id: number, data: any, quoteId?: string | null) {
  try {
    // VÉRIFICATION DE SÉCURITÉ BACKEND
    if (quoteId) {
      const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
      if (quote?.status === "ACCEPTED") {
        return { success: false, error: "Impossible de modifier une dépense liée à un devis accepté." };
      }
    }

    await updateTransaction(id, data);
    revalidatePath("/expenses");
    if (quoteId) revalidatePath(`/quotes/${quoteId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteExpenseAction(id: number, quoteId?: string | null) {
  try {
    // VÉRIFICATION DE SÉCURITÉ BACKEND
    if (quoteId) {
      const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
      if (quote?.status === "ACCEPTED") {
        return { success: false, error: "Impossible de supprimer une dépense liée à un devis accepté." };
      }
    }

    await deleteTransaction(id);
    revalidatePath("/expenses");
    if (quoteId) revalidatePath(`/quotes/${quoteId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}