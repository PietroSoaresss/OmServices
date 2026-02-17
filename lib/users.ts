import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function createUser(data: {
  name?: string | null;
  email: string;
  password: string;
  role?: Role;
}) {
  const passwordHash = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name || null,
      email: data.email,
      password: passwordHash,
      role: data.role ?? "USER"
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
}
