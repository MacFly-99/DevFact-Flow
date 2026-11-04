import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
      companyName: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      companyAddress: { 
        type: "string",
        required: false 
      },
      companySiret: { 
        type: "string",
        required: false 
      },
      companyVat: { 
        type: "string", 
        required: false 
      },
    },
  },
  plugins: [
    nextCookies(),
  ],
});