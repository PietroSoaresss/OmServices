"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export function Filters() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const query = new URLSearchParams();

    ["type", "status", "start", "end", "q"].forEach((key) => {
      const value = String(form.get(key) || "").trim();
      if (value) query.set(key, value);
    });

    router.push(`/ocorrencias?${query.toString()}`);
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-3 md:grid-cols-6">
      <Input name="q" label="Busca" placeholder="Titulo ou descricao" defaultValue={params.get("q") || ""} />
      <Select
        name="type"
        label="Tipo"
        defaultValue={params.get("type") || ""}
        options={[
          { label: "Todos", value: "" },
          { label: "Manutencao", value: "MANUTENCAO" },
          { label: "Incidente", value: "INCIDENTE" },
          { label: "Solicitacao", value: "SOLICITACAO" },
          { label: "Outro", value: "OUTRO" }
        ]}
      />
      <Select
        name="status"
        label="Status"
        defaultValue={params.get("status") || ""}
        options={[
          { label: "Todos", value: "" },
          { label: "Aberta", value: "ABERTA" },
          { label: "Resolvida", value: "RESOLVIDA" }
        ]}
      />
      <Input name="start" type="date" label="Inicio" defaultValue={params.get("start") || ""} />
      <Input name="end" type="date" label="Fim" defaultValue={params.get("end") || ""} />
      <div className="flex items-end gap-2">
        <Button type="submit" loading={loading} className="w-full">Filtrar</Button>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/ocorrencias">Limpar</Link>
        </Button>
      </div>
    </form>
  );
}
