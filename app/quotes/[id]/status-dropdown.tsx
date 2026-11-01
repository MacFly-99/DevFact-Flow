"use client";

import { useState, useTransition } from "react";
import { updateQuoteStatus } from "../actions";
import { QuoteStatus } from "../../../src/generated/prisma/client";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function StatusDropdown({ quoteId, currentStatus }: { quoteId: string, currentStatus: QuoteStatus }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const statuses: QuoteStatus[] = ["DRAFT", "SENT", "ACCEPTED", "REJECTED"];

  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case "ACCEPTED": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "REJECTED": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "SENT": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-brand-accent/20 text-brand-accent border-brand-accent/30";
    }
  };

  const handleStatusChange = (newStatus: QuoteStatus) => {
    setOpen(false);
    startTransition(() => {
      updateQuoteStatus(quoteId, newStatus);
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* Correction ici : on utilise render au lieu de asChild */}
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
        {currentStatus}
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
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}