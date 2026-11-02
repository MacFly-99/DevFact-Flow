"use client";

import { useState } from "react";
import { Send, Loader2, Check } from "lucide-react";
import { sendDocument } from "@/lib/actions/send-document";

export function SendDocumentButton({ id, type }: { id: string, type: "quote" | "invoice" }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSend = async () => {
    setStatus("loading");
    try {
      await sendDocument(id, type);
      setStatus("success");
      // On remet le bouton à son état normal après 3 secondes
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <button 
      onClick={handleSend}
      disabled={status === "loading" || status === "success"}
      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-bold cursor-pointer disabled:opacity-70
        ${status === "success" ? "bg-green-500 text-white" : "bg-brand-accent text-brand-night hover:bg-brand-accent/90"}
      `}
    >
      {status === "idle" && <><Send className="h-4 w-4" /> Envoyer</>}
      {status === "loading" && <><Loader2 className="h-4 w-4 animate-spin" /> Envoi...</>}
      {status === "success" && <><Check className="h-4 w-4" /> Envoyé !</>}
      {status === "error" && <><Send className="h-4 w-4" /> Erreur</>}
    </button>
  );
}