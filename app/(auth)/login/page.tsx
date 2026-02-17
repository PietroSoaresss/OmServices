"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginSchema } from "@/lib/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const values = {
      email: String(form.get("email") || ""),
      password: String(form.get("password") || "")
    };
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Dados invalidos");
      return;
    }
    setLoading(true);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false
    });
    setLoading(false);
    if (result?.error) {
      setError("Credenciais invalidas");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
        <div className="w-full rounded-2xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10">
          <h1 className="text-2xl font-semibold">Ocorrencias</h1>
          <p className="mt-2 text-sm text-slate-300">Acesse com seu email e senha.</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Input name="email" type="email" label="Email" placeholder="seu@email.com" />
            <Input name="password" type="password" label="Senha" placeholder="********" />
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <Button type="submit" loading={loading} className="w-full">Entrar</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
