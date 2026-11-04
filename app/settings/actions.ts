"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateCompanySettings(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const companyName = formData.get("companyName") as string;
  const companyAddress = formData.get("companyAddress") as string;
  const companySiret = formData.get("companySiret") as string;
  const companyVat = formData.get("companyVat") as string;
  const phone = formData.get("phone") as string;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      companyName: companyName || null,
      companyAddress: companyAddress || null,
      companySiret: companySiret || null,
      companyVat: companyVat || null,
      phone: phone || null,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/quotes");
  revalidatePath("/invoices");

  return { success: true };
}