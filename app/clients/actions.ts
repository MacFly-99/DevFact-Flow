"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!name) {
    throw new Error("Le nom est obligatoire");
  }

  await prisma.client.create({
    data: {
      name: name,
      email: email || null,
      phone: phone || null,
    },
  });

  // On rafraîchit la page /clients en arrière-plan
  revalidatePath("/clients");
}