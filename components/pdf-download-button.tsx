"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export function PdfDownloadButton({ id, type }: { id: string, type: "quote" | "invoice" }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // On fetch l'API
      const res = await fetch(`/api/pdf?id=${id}&type=${type}`);
      if (!res.ok) throw new Error("Erreur de génération");

      // On récupère le fichier sous forme de Blob
      const blob = await res.blob();
      
      // On crée un lien temporaire pour déclencher le téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.headers.get("Content-Disposition")?.split('filename="')[1].replace('"', '') || "document.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération du PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-md transition-colors text-sm font-medium cursor-pointer disabled:opacity-50"
    >
      {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {isDownloading ? "Génération..." : "PDF"}
    </button>
  );
}