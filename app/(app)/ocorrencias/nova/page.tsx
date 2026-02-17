import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OccurrenceForm } from "@/components/occurrences/OccurrenceForm";

export default async function NewOccurrencePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Nova ocorrencia</h1>
        <p className="text-sm text-slate-500">Registre uma nova ocorrencia interna.</p>
      </div>
      <OccurrenceForm mode="create" />
    </div>
  );
}


