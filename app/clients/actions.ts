"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
  const companyName = formData.get("companyName") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!name || !email) {
    throw new Error("Le nom et l'email sont obligatoires");
  }

  await prisma.client.create({
    data: {
      companyName: companyName || null,
      name: name,
      email: email, // Plus de "|| null"
      phone: phone || null,
    },
  });

  revalidatePath("/clients");
}