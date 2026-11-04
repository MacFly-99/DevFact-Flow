"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UpdateProfileSchema } from "@/lib/validations";

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = UpdateProfileSchema.safeParse(rawData);

  if (!validatedFields.success) throw new Error(validatedFields.error.issues[0].message);

  const { name, companyName, phone } = validatedFields.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name,
      companyName: companyName || null,
      phone: phone || null,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
}