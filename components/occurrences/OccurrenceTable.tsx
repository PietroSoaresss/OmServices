"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

type OccurrenceItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdAt: string;
  resolvedAt?: string | null;
  createdBy?: { name: string | null; email: string } | null;
};

type OccurrenceData = {
  items: OccurrenceItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function OccurrenceTable({ data, isAdmin }: { data: OccurrenceData; isAdmin: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setLoadingId(id);
    await fetch(`/api/occurrences/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    setLoadingId(null);
    router.refresh();
  }

  async function remove(id: string) {
    setLoadingId(id);
    await fetch(`/api/occurrences/${id}`, { method: "DELETE" });
    setLoadingId(null);
    setDeleteId(null);
    router.refresh();
  }

  function goToPage(page: number) {
    const query = new URLSearchParams(params.toString());
    query.set("page", String(page));
    router.push(`/ocorrencias?${query.toString()}`);
  }

  const isFirst = data.page <= 1;
  const isLast = data.page >= (data.totalPages || 1);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Total: {data.total}</p>
        <p className="text-sm text-slate-500">Pagina {data.page} de {data.totalPages || 1}</p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-2">Titulo</th>
              <th className="py-2">Tipo</th>
              <th className="py-2">Status</th>
              <th className="py-2">Criada em</th>
              <th className="py-2">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-3">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.description}</div>
                </td>
                <td className="py-3">{item.type}</td>
                <td className="py-3">
                  <Badge variant={item.status === "RESOLVIDA" ? "success" : "warning"}>
                    {item.status}
                  </Badge>
                </td>
                <td className="py-3">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="secondary">
                      <a href={`/ocorrencias/${item.id}`}>{isAdmin ? "Ver/Editar" : "Ver"}</a>
                    </Button>
                    {isAdmin ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        loading={loadingId === item.id}
                        onClick={() =>
                          updateStatus(item.id, item.status === "RESOLVIDA" ? "ABERTA" : "RESOLVIDA")
                        }
                      >
                        {item.status === "RESOLVIDA" ? "Reabrir" : "Resolver"}
                      </Button>
                    ) : null}
                    {isAdmin ? (
                      <Button size="sm" variant="danger" onClick={() => setDeleteId(item.id)}>
                        Excluir
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button size="sm" variant="secondary" onClick={() => goToPage(data.page - 1)} disabled={isFirst}>
          Anterior
        </Button>
        <Button size="sm" variant="secondary" onClick={() => goToPage(data.page + 1)} disabled={isLast}>
          Proxima
        </Button>
      </div>

      <Modal
        open={!!deleteId}
        title="Confirmar exclusao"
        description="Essa acao nao pode ser desfeita."
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && remove(deleteId)}
        confirmLabel="Excluir"
      />
    </div>
  );
}
