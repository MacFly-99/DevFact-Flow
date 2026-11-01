import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { PdfDocument } from "@/lib/pdf/document-template";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return new NextResponse("Non autorisé", { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // "quote" ou "invoice"

    if (!id || !type) return new NextResponse("Paramètres manquants", { status: 400 });

    let documentData;
    let docTypeLabel: "DEVIS" | "FACTURE" = "DEVIS";
    let fileName = "";

    if (type === "quote") {
      const quote = await prisma.quote.findFirst({
        where: { id, userId: session.user.id },
        include: { client: true, items: true },
      });
      if (!quote) return new NextResponse("Devis introuvable", { status: 404 });
      
      documentData = {
        number: quote.number,
        date: new Date(quote.createdAt).toLocaleDateString('fr-FR'),
        status: quote.status,
        client: quote.client,
        items: quote.items,
        total: quote.total,
      };
      docTypeLabel = "DEVIS";
      fileName = `Devis-${quote.number}.pdf`;
    } else {
      const invoice = await prisma.invoice.findFirst({
        where: { id, userId: session.user.id },
        include: { client: true, items: true },
      });
      if (!invoice) return new NextResponse("Facture introuvable", { status: 404 });

      const dueDate = new Date(invoice.createdAt);
      dueDate.setDate(dueDate.getDate() + 30);

      documentData = {
        number: invoice.number,
        date: new Date(invoice.createdAt).toLocaleDateString('fr-FR'),
        dueDate: dueDate.toLocaleDateString('fr-FR'),
        status: invoice.status,
        client: invoice.client,
        items: invoice.items,
        total: invoice.total,
      };
      docTypeLabel = "FACTURE";
      fileName = `Facture-${invoice.number}.pdf`;
    }

    // Génération du flux PDF
    const stream = await renderToStream(
      <PdfDocument type={docTypeLabel} {...documentData} />
    );

    // Conversion du stream en Buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error("Erreur génération PDF:", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}