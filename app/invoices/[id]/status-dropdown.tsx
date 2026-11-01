"use client";

import { useState, useTransition } from "react";
import { updateInvoiceStatus } from "../actions";
import { InvoiceStatus } from "../../../src/generated/prisma/client";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function InvoiceStatusDropdown({ invoiceId, currentStatus }: { invoiceId: string, currentStatus: InvoiceStatus }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  // Les statuts spécifiques aux factures
  const statuses: InvoiceStatus[] = ["DRAFT", "SENT", "PAID", "OVERDUE"];

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "PAID": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "OVERDUE": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "SENT": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-brand-accent/20 text-brand-accent border-brand-accent/30";
    }
  };

  // Petite fonction pour traduire en français à l'affichage
  const getStatusLabel = (status: InvoiceStatus) => {
    switch (status) {
      case "PAID": return "Payée";
      case "OVERDUE": return "En retard";
      case "SENT": return "Envoyée";
      default: return "Brouillon";
    }
  };

  const handleStatusChange = (newStatus: InvoiceStatus) => {
    setOpen(false);
    startTransition(() => {
      updateInvoiceStatus(invoiceId, newStatus);
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger 
        render={
          <button 
            disabled={isPending}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase border transition-all cursor-pointer hover:opacity-80",
              getStatusColor(currentStatus),
              isPending && "opacity-50 cursor-wait"
            )}
          />
        }
      >
        {getStatusLabel(currentStatus)}
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="bg-[#151c2e] border-white/10 text-text-main shadow-xl w-40">
        {statuses.map((status) => (
          <DropdownMenuItem 
            key={status}
            onClick={() => handleStatusChange(status)}
            className={cn(
              "cursor-pointer font-medium py-2 focus:bg-white/10",
              currentStatus === status ? "text-brand-accent" : "text-text-muted hover:text-white"
            )}
          >
            {getStatusLabel(status)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}