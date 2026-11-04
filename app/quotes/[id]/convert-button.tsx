"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { convertToInvoice } from "../actions";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ConvertToInvoiceButton({ quoteId }: { quoteId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConvert = () => {
    startTransition(async () => {
      try {
        const result = await convertToInvoice(quoteId);
        
        toast.success(result.message || "Facture générée !", { 
          description: "Le devis a bien été converti." 
        });
        
        router.push(`/invoices/${result.invoiceId}`);
        router.refresh();

      } catch (error: any) {
        toast.error("Erreur", { description: error.message || "Impossible de convertir le devis." });
      }
    });
  };

  return (
    <button
      onClick={handleConvert}
      disabled={isPending}
      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-bold transition-colors shadow-lg shadow-green-500/20 cursor-pointer disabled:opacity-50"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
      {isPending ? "Conversion..." : "Convertir en Facture"}
    </button>
  );
}