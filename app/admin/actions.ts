"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Sécurité : Seul un ADMIN peut faire ça
  if (!session || (session.user as any)?.role !== "ADMIN") {
    throw new Error("Non autorisé");
  }

  // Sécurité : Un admin ne peut pas se supprimer lui-même
  if (session.user.id === userId) {
    throw new Error("Vous ne pouvez pas supprimer votre propre compte Admin.");
  }

  // Suppression (les clients et devis seront supprimés en cascade par Prisma)
  await prisma.user.delete({
    where: { id: userId },
  });

  // On rafraîchit la page admin
  revalidatePath("/admin");
}