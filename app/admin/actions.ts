"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { IdSchema } from "@/lib/validations";

export async function deleteUser(userId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user as any)?.role !== "ADMIN") throw new Error("Non autorisé");

  // Validation de l'ID
  const validatedId = IdSchema.safeParse(userId);
  if (!validatedId.success) throw new Error("Identifiant invalide.");

  // Sécurité : Un admin ne peut pas se supprimer lui-même
  if (session.user.id === validatedId.data) {
    throw new Error("Vous ne pouvez pas supprimer votre propre compte Admin.");
  }

  await prisma.user.delete({
    where: { id: validatedId.data },
  });

  revalidatePath("/admin");
}