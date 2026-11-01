"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

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
      email: email,
      phone: phone || null,
      userId: session.user.id, // Lien avec l'utilisateur
    },
  });

  revalidatePath("/clients");
}