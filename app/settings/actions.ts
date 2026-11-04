"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UpdateCompanySchema } from "@/lib/validations";

export async function updateCompanySettings(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = UpdateCompanySchema.safeParse(rawData);

  if (!validatedFields.success) throw new Error(validatedFields.error.issues[0].message);

  const { companyName, companyAddress, companySiret, companyVat, phone } = validatedFields.data;

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