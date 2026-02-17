import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@ocorrencias.local";
  const password = process.env.ADMIN_PASSWORD || "Admin#123";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      name: "Admin",
      password: hashed,
      role: Role.ADMIN
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
