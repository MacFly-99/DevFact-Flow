"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ExpenseSchema, IdSchema } from "@/lib/validations";
import { limiters } from "@/lib/rate-limit";

export async function addExpenseAction(rawData: any) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const { success, reset } = await limiters.actions.limit(session.user.id);
  if (!success) return { success: false, error: `Trop de tentatives. Réessayez dans ${Math.ceil((reset - Date.now()) / 1000)}s.` };

  const validated = ExpenseSchema.safeParse(rawData);
  if (!validated.success) return { success: false, error: validated.error.issues[0].message };

  const { description, montant, categorie, date, quote_id } = validated.data;

  try {
    await prisma.expense.create({
      data: {
        description,
        montant,
        categorie,
        date: new Date(date),
        userId: session.user.id,
        quoteId: quote_id || null,
      }
    });

    revalidatePath("/expenses");
    if (quote_id) revalidatePath(`/quotes/${quote_id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateExpenseAction(id: string, rawData: any, quoteId?: string | null) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const { success, reset } = await limiters.actions.limit(session.user.id);
  if (!success) return { success: false, error: `Trop de tentatives. Réessayez dans ${Math.ceil((reset - Date.now()) / 1000)}s.` };

  const validatedId = IdSchema.safeParse(id);
  if (!validatedId.success) return { success: false, error: "ID invalide" };

  const validated = ExpenseSchema.safeParse(rawData);
  if (!validated.success) return { success: false, error: validated.error.issues[0].message };

  try {
    // VÉRIFICATION DE SÉCURITÉ (Anti-IDOR)
    const existingExpense = await prisma.expense.findFirst({
      where: { id: validatedId.data, userId: session.user.id }
    });
    if (!existingExpense) return { success: false, error: "Dépense introuvable ou non autorisée." };

    if (quoteId) {
      const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
      if (quote?.status === "ACCEPTED") {
        return { success: false, error: "Impossible de modifier une dépense liée à un devis accepté." };
      }
    }

    await prisma.expense.update({
      where: { id: validatedId.data },
      data: {
        description: validated.data.description,
        montant: validated.data.montant,
        categorie: validated.data.categorie,
        date: new Date(validated.data.date),
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

  const { success, reset } = await limiters.actions.limit(session.user.id);
  if (!success) return { success: false, error: `Trop de tentatives. Réessayez dans ${Math.ceil((reset - Date.now()) / 1000)}s.` };

  const validatedId = IdSchema.safeParse(id);
  if (!validatedId.success) return { success: false, error: "ID invalide" };

  try {
    // VÉRIFICATION DE SÉCURITÉ (Anti-IDOR)
    const existingExpense = await prisma.expense.findFirst({
      where: { id: validatedId.data, userId: session.user.id }
    });
    if (!existingExpense) return { success: false, error: "Dépense introuvable ou non autorisée." };

    if (quoteId) {
      const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
      if (quote?.status === "ACCEPTED") {
        return { success: false, error: "Impossible de supprimer une dépense liée à un devis accepté." };
      }
    }

    await prisma.expense.delete({ where: { id: validatedId.data } });

    revalidatePath("/expenses");
    if (quoteId) revalidatePath(`/quotes/${quoteId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}