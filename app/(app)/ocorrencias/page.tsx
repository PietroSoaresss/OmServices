import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listOccurrences } from "@/lib/occurrences";
import { OccurrenceTable } from "@/components/occurrences/OccurrenceTable";
import { Filters } from "@/components/occurrences/Filters";
import { Button } from "@/components/ui/Button";

export default async function OccurrencesPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const result = await listOccurrences(searchParams, {
    userId: session.user.id,
    isAdmin: session.user.role === "ADMIN"
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Ocorrencias</h1>
          <p className="text-sm text-slate-500">Gerencie registros internos.</p>
        </div>
        <Button asChild>
          <Link href="/ocorrencias/nova">Nova ocorrencia</Link>
        </Button>
      </div>

      <Filters />
      <OccurrenceTable data={result} isAdmin={session.user.role === "ADMIN"} />
    </div>
  );
}


