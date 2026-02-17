"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserSchema } from "@/lib/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export function UserForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      name: String(form.get("name") || "") || null,
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      role: String(form.get("role") || "USER")
    };

    const parsed = createUserSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Dados invalidos");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data)
    });
    setLoading(false);
    if (!response.ok) {
      const message = response.status === 409 ? "Email ja cadastrado" : "Nao foi possivel criar usuario";
      setError(message);
      return;
    }

    formEl.reset();
    setSuccess("Usuario criado com sucesso");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      onChange={() => {
        if (error) setError(null);
        if (success) setSuccess(null);
      }}
      className="card space-y-4"
    >
      <Input name="name" label="Nome" placeholder="Nome completo" />
      <Input name="email" label="Email" type="email" placeholder="email@empresa.com" />
      <Input name="password" label="Senha" type="password" />
      <Select
        name="role"
        label="Cargo"
        defaultValue="USER"
        options={[
          { label: "Usuario", value: "USER" },
          { label: "Admin", value: "ADMIN" }
        ]}
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
      <div className="flex gap-2">
        <Button type="submit" loading={loading}>
          Criar usuario
        </Button>
      </div>
    </form>
  );
}
