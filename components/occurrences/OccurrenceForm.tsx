"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { occurrenceCreateSchema, occurrenceUpdateSchema } from "@/lib/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type OccurrenceFormProps = {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    description: string;
    type: string;
    location?: string | null;
  };
};

export function OccurrenceForm({ mode, initialData }: OccurrenceFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title") || ""),
      description: String(form.get("description") || ""),
      type: String(form.get("type") || ""),
      location: String(form.get("location") || "") || null
    };

    const schema = mode === "create" ? occurrenceCreateSchema : occurrenceUpdateSchema;
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Dados invalidos");
      return;
    }

    setLoading(true);
    const response = await fetch(
      mode === "create" ? "/api/occurrences" : `/api/occurrences/${initialData?.id}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data)
      }
    );
    setLoading(false);
    if (!response.ok) {
      setError("Nao foi possivel salvar");
      return;
    }
    router.push("/ocorrencias");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <Input name="title" label="Titulo" defaultValue={initialData?.title} />
      <Input name="description" label="Descricao" defaultValue={initialData?.description} />
      <Select
        name="type"
        label="Tipo"
        defaultValue={initialData?.type || "MANUTENCAO"}
        options={[
          { label: "Manutencao", value: "MANUTENCAO" },
          { label: "Incidente", value: "INCIDENTE" },
          { label: "Solicitacao", value: "SOLICITACAO" },
          { label: "Outro", value: "OUTRO" }
        ]}
      />
      <Input name="location" label="Local" defaultValue={initialData?.location || ""} />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Cadastrar" : "Salvar"}
        </Button>
        <Button variant="secondary" type="button" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    </form>
  );
}
