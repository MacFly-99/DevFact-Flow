"use server";

import { createTransaction, updateTransaction, deleteTransaction } from "@/lib/devspend";
import { revalidatePath } from "next/cache";

export async function addExpenseAction(data: any) {
  try {
    await createTransaction(data);
    revalidatePath("/expenses"); // Rafraîchit automatiquement la page
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateExpenseAction(id: number, data: any) {
  try {
    await updateTransaction(id, data);
    revalidatePath("/expenses");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteExpenseAction(id: number) {
  try {
    await deleteTransaction(id);
    revalidatePath("/expenses");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}