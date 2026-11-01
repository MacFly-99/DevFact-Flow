import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Super Admin";

  if (!adminEmail || !adminPassword) {
    throw new Error("❌ Les variables ADMIN_EMAIL et ADMIN_PASSWORD doivent être définies dans le .env");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Le Super Admin existe déjà.");
    return;
  }

  const hashedPassword = await hashPassword(adminPassword);

  // 1. On crée d'abord l'utilisateur pour obtenir son ID
  const adminUser = await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      role: "ADMIN",
      emailVerified: true,
    },
  });

  // 2. On crée le compte "credential" en utilisant l'ID de l'utilisateur
  await prisma.account.create({
    data: {
      userId: adminUser.id,
      providerId: "credential",
      accountId: adminUser.id,
      password: hashedPassword,
    },
  });

  console.log(`🚀 Super Admin créé !`);
  console.log(`📧 Email : ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });