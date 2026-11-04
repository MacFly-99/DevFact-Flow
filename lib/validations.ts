import { z } from "zod";

// Validation d'un ID (UUID) pour toutes nos Server Actions
export const IdSchema = z.string().uuid("L'identifiant fourni est invalide.");

// --- CLIENTS ---
export const ClientSchema = z.object({
  companyName: z.string().max(100).optional(),
  name: z.string().min(1, "Le nom du contact est requis").max(100),
  email: z.string().email("L'adresse email est invalide"),
  phone: z.string().max(20).optional(),
});

// --- DEVIS ET FACTURES ---
const QuoteItemSchema = z.object({
  description: z.string().min(1, "La description est requise").max(255),
  quantity: z.number().min(1, "La quantité doit être d'au moins 1"),
  unitPrice: z.number().min(0, "Le prix ne peut pas être négatif"),
});

export const CreateQuoteSchema = z.object({
  clientId: IdSchema,
  taxRate: z.number().min(0).max(100),
  items: z.array(QuoteItemSchema).min(1, "Il faut au moins une ligne d'article"),
});

export const QuoteStatusSchema = z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED"]);
export const InvoiceStatusSchema = z.enum(["DRAFT", "SENT", "PAID", "OVERDUE"]);

// --- PROFIL & PARAMETRES ---
export const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100),
  companyName: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
});

export const UpdateCompanySchema = z.object({
  companyName: z.string().max(100).optional(),
  companyAddress: z.string().max(255).optional(),
  companySiret: z.string().max(20).optional(),
  companyVat: z.string().max(20).optional(),
  phone: z.string().max(20).optional(),
});