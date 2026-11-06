import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL, 
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "USER", input: false },
      companyName: { type: "string", required: false },
      phone: { type: "string", required: false },
      companyAddress: { type: "string", required: false },
      companySiret: { type: "string", required: false },
      companyVat: { type: "string", required: false },
    },
  },
  // Configuration du Rate Limiting
  rateLimit: {
    storage: "database", // Persiste les données en base pour résister aux redémarrages
    window: 600,         // Fenêtre de 10 minutes (en secondes)
    max: 5,              // 5 requêtes maximum par fenêtre
    customRules: {
      // On applique une règle stricte uniquement sur les routes sensibles
      "/api/auth/sign-in/email": { window: 600, max: 5 },
      "/api/auth/sign-up/email": { window: 600, max: 5 },
    },
  },
  plugins: [
    nextCookies(),
  ],
});