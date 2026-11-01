"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const name = formData.get("name") as string;
  const companyName = formData.get("companyName") as string;
  const phone = formData.get("phone") as string;

  if (!name) throw new Error("Le nom est obligatoire");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      companyName: companyName || null,
      phone: phone || null,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
}