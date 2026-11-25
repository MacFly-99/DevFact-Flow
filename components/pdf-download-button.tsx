"use client";

import { useState } from "react";
import { Download, Loader2, ChevronDown, Lock } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PdfDownloadButton({ id, type }: { id: string, type: "quote" | "invoice" }) {
  const [isDownloading, setIsDownloading] = useState<string | null>(null); // Stocke "client" ou "internal"

  const handleDownload = async (variant: "client" | "internal") => {
    setIsDownloading(variant);
    try {
      const res = await fetch(`/api/pdf?id=${id}&type=${type}&variant=${variant}`);
      if (!res.ok) throw new Error("Erreur de génération");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const disposition = res.headers.get("Content-Disposition");
      const filename = disposition?.split('filename="')[1]?.replace('"', '') || `document-${variant}.pdf`;
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération du PDF.");
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <button 
          disabled={!!isDownloading}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-md transition-colors text-sm font-medium cursor-pointer disabled:opacity-50"
        >
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {isDownloading ? "Génération..." : "Télécharger PDF"}
          <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
        </button>
      } />
      
      <DropdownMenuContent align="end" className="bg-[#151c2e] border-white/10 text-white w-56">
        <DropdownMenuItem 
          onClick={() => handleDownload("client")}
          className="cursor-pointer hover:bg-white/10 flex items-center gap-2 py-2"
        >
          <Download className="h-4 w-4 text-brand-accent" />
          <div>
            <p className="font-bold text-sm">Version Client</p>
            <p className="text-[10px] text-gray-400">Sans les marges ni les coûts</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleDownload("internal")}
          className="cursor-pointer hover:bg-white/10 flex items-center gap-2 py-2 mt-1"
        >
          <Lock className="h-4 w-4 text-red-400" />
          <div>
            <p className="font-bold text-sm text-red-400">Version Interne</p>
            <p className="text-[10px] text-gray-400">Avec dépenses et bénéfices</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}