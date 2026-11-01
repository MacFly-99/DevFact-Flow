"use client";

import { useTransition } from "react";
import { convertToInvoice } from "../actions";
import { FileText, Loader2 } from "lucide-react";

export function ConvertToInvoiceButton({ quoteId }: { quoteId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => convertToInvoice(quoteId))}
      disabled={isPending}
      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-bold transition-colors shadow-lg shadow-green-500/20 cursor-pointer disabled:opacity-50"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
      {isPending ? "Création..." : "Convertir en Facture"}
    </button>
  );
}