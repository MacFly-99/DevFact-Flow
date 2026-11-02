"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Resend } from "resend";
import { renderToStream } from "@react-pdf/renderer";
import { PdfDocument } from "@/lib/pdf/document-template";
import React from "react";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDocument(id: string, type: "quote" | "invoice") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");

  let documentData;
  let docTypeLabel: "DEVIS" | "FACTURE" = "DEVIS";
  let fileName = "";
  let clientEmail = "";
  let clientName = "";
  let docNumber = "";
  let currentStatus = "";

  // 1. Récupération des données
  if (type === "quote") {
    const quote = await prisma.quote.findFirst({
      where: { id, userId: session.user.id },
      include: { client: true, items: true },
    });
    if (!quote) throw new Error("Devis introuvable");

    documentData = {
      number: quote.number, date: new Date(quote.createdAt).toLocaleDateString('fr-FR'), status: quote.status,
      client: quote.client, items: quote.items, total: quote.total, taxRate: quote.taxRate, taxAmount: quote.taxAmount, totalTTC: quote.totalTTC,
    };
    docTypeLabel = "DEVIS";
    fileName = `Devis-${quote.number}.pdf`;
    clientEmail = quote.client.email;
    clientName = quote.client.name;
    docNumber = quote.number;
    currentStatus = quote.status;
  } else {
    const invoice = await prisma.invoice.findFirst({
      where: { id, userId: session.user.id },
      include: { client: true, items: true },
    });
    if (!invoice) throw new Error("Facture introuvable");

    const dueDate = new Date(invoice.createdAt);
    dueDate.setDate(dueDate.getDate() + 30);

    documentData = {
      number: invoice.number, date: new Date(invoice.createdAt).toLocaleDateString('fr-FR'), dueDate: dueDate.toLocaleDateString('fr-FR'), status: invoice.status,
      client: invoice.client, items: invoice.items, total: invoice.total, taxRate: invoice.taxRate, taxAmount: invoice.taxAmount, totalTTC: invoice.totalTTC,
    };
    docTypeLabel = "FACTURE";
    fileName = `Facture-${invoice.number}.pdf`;
    clientEmail = invoice.client.email;
    clientName = invoice.client.name;
    docNumber = invoice.number;
    currentStatus = invoice.status;
  }

  // 2. Génération du PDF en mémoire (Buffer)
  const stream = await renderToStream(<PdfDocument type={docTypeLabel} {...documentData} />);
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const pdfBuffer = Buffer.concat(chunks);

  // 3. Envoi de l'email via Resend
  const { data, error } = await resend.emails.send({
    from: "DevFact Flow <onboarding@resend.dev>", 
    to: ["matxav99@gmail.com"], 
    subject: `Votre ${docTypeLabel.toLowerCase()} #${docNumber}`,
    html: `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <h2>Bonjour ${clientName},</h2>
        <p>Veuillez trouver ci-joint votre ${docTypeLabel.toLowerCase()} <strong>#${docNumber}</strong>.</p>
        <p>N'hésitez pas à nous contacter si vous avez la moindre question.</p>
        <br />
        <p>Cordialement,</p>
        <p><strong>L'équipe DevFact Flow</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: fileName,
        content: pdfBuffer,
      },
    ],
  });

  if (error) {
    console.error("Erreur Resend:", error);
    throw new Error("Impossible d'envoyer l'email.");
  }

  // 4. Mise à jour du statut
  if (currentStatus === "DRAFT") {
    if (type === "quote") {
      await prisma.quote.update({ where: { id }, data: { status: "SENT" } });
      revalidatePath(`/quotes/${id}`);
      revalidatePath("/quotes");
    } else {
      await prisma.invoice.update({ where: { id }, data: { status: "SENT" } });
      revalidatePath(`/invoices/${id}`);
      revalidatePath("/invoices");
    }
  }

  return { success: true };
}