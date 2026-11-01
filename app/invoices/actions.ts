"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { InvoiceStatus } from "../../src/generated/prisma/client";

export async function updateInvoiceStatus(invoiceId: string, newStatus: InvoiceStatus) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: session.user.id }
  });
  if (!invoice) throw new Error("Facture introuvable");

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: newStatus },
  });

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
}