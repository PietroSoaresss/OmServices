import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OccurrenceForm } from "@/components/occurrences/OccurrenceForm";
import { Badge } from "@/components/ui/Badge";

export default async function OccurrenceDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const item = await prisma.occurrence.findUnique({
    where: { id: params.id }
  });

  if (!item) {
    notFound();
  }
  if (session.user.role !== "ADMIN" && item.createdById !== session.user.id) {
    notFound();
  }

  if (session.user.role !== "ADMIN") {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Ocorrencia</h1>
          <p className="text-sm text-slate-500">Visualizacao somente leitura.</p>
        </div>
        <div className="card space-y-3 text-sm">
          <div>
            <p className="text-slate-500">Titulo</p>
            <p className="font-medium">{item.title}</p>
          </div>
          <div>
            <p className="text-slate-500">Descricao</p>
            <p>{item.description}</p>
          </div>
          <div>
            <p className="text-slate-500">Tipo</p>
            <p>{item.type}</p>
          </div>
          <div>
            <p className="text-slate-500">Status</p>
            <Badge variant={item.status === "RESOLVIDA" ? "success" : "warning"}>{item.status}</Badge>
          </div>
          <div>
            <p className="text-slate-500">Criada em</p>
            <p>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</p>
          </div>
          {item.resolvedAt ? (
            <div>
              <p className="text-slate-500">Resolvida em</p>
              <p>{new Date(item.resolvedAt).toLocaleDateString("pt-BR")}</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Editar ocorrencia</h1>
        <p className="text-sm text-slate-500">Atualize os dados da ocorrencia.</p>
      </div>
      <OccurrenceForm
        mode="edit"
        initialData={{
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.type,
          location: item.location
        }}
      />
    </div>
  );
}


