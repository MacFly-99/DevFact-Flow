"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(formData: FormData) {
  // On récupère les données du formulaire
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  // Sécurité basique
  if (!name) {
    throw new Error("Le nom est obligatoire");
  }

  // On sauvegarde dans PostgreSQL
  await prisma.client.create({
    data: {
      name: name,
      email: email || null,
      phone: phone || null,
    },
  });

  // On dit à Next.js de rafraîchir les données de la page /clients
  revalidatePath("/clients");
  
  // On redirige l'utilisateur vers la liste
  redirect("/clients");
}