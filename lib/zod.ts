import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "Senha obrigatoria")
});

export const occurrenceCreateSchema = z.object({
  title: z.string().min(3, "Titulo deve ter no minimo 3 caracteres"),
  description: z.string().min(5, "Descricao deve ter no minimo 5 caracteres"),
  type: z.enum(["MANUTENCAO", "INCIDENTE", "SOLICITACAO", "OUTRO"]),
  location: z.string().optional().nullable()
});

export const occurrenceUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  type: z.enum(["MANUTENCAO", "INCIDENTE", "SOLICITACAO", "OUTRO"]).optional(),
  location: z.string().optional().nullable()
});

export const occurrenceStatusSchema = z.object({
  status: z.enum(["ABERTA", "RESOLVIDA"])
});

export const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter no minimo 2 caracteres").optional().nullable(),
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "Senha deve ter no minimo 6 caracteres"),
  role: z.enum(["ADMIN", "USER"]).optional()
});
