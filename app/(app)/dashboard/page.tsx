import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { startOfMonthUtc, endOfMonthUtc } from "@/lib/helpers";
import { Badge } from "@/components/ui/Badge";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const monthStart = startOfMonthUtc(new Date());
  const monthEnd = endOfMonthUtc(new Date());
  const isAdmin = session.user.role === "ADMIN";
  const baseWhere = isAdmin ? {} : { createdById: session.user.id };

  const [totalMonth, totalOpen, totalResolved, monthItems, resolvedMonth] = await Promise.all([
    prisma.occurrence.count({
      where: { ...baseWhere, createdAt: { gte: monthStart, lte: monthEnd } }
    }),
    prisma.occurrence.count({ where: { ...baseWhere, status: "ABERTA" } }),
    prisma.occurrence.count({ where: { ...baseWhere, status: "RESOLVIDA" } }),
    prisma.occurrence.findMany({
      where: { ...baseWhere, createdAt: { gte: monthStart, lte: monthEnd } },
      select: { type: true }
    }),
    prisma.occurrence.findMany({
      where: { ...baseWhere, resolvedAt: { gte: monthStart, lte: monthEnd } },
      select: { createdAt: true, resolvedAt: true }
    })
  ]);

  const typeCounts = monthItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const totalTypes = Object.values(typeCounts).reduce((sum, value) => sum + value, 0);
  const donutColors = ["#0ea5e9", "#22c55e", "#f97316", "#a855f7"];
  const typeEntries = Object.entries(typeCounts);
  let offset = 0;
  const segments = typeEntries.map(([type, count], index) => {
    const percent = totalTypes ? (count / totalTypes) * 100 : 0;
    const startOffset = offset;
    offset += percent;
    return {
      type,
      count,
      percent,
      startOffset,
      color: donutColors[index % donutColors.length]
    };
  });

  const avgMinutes = resolvedMonth.length
    ? Math.round(
        resolvedMonth.reduce((sum, item) => {
          const diffMs = item.resolvedAt!.getTime() - item.createdAt.getTime();
          return sum + Math.max(0, Math.round(diffMs / 60000));
        }, 0) / resolvedMonth.length
      )
    : 0;
  const avgHours = Math.floor(avgMinutes / 60);
  const avgRemainingMinutes = avgMinutes % 60;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-500">Resumo do mes atual.</p>
        </div>
        <Badge>Atualizado</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500">Total no mês</p>
          <p className="mt-2 text-3xl font-semibold">{totalMonth}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Total abertas</p>
          <p className="mt-2 text-3xl font-semibold">{totalOpen}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Total resolvidas</p>
          <p className="mt-2 text-3xl font-semibold">{totalResolved}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold">Ocorrencias por tipo (mes atual)</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
            <div className="flex items-center justify-center">
              {totalTypes === 0 ? (
                <div className="flex h-36 w-36 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500">
                  Sem dados
                </div>
              ) : (
                <svg viewBox="0 0 36 36" className="h-36 w-36 -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="transparent"
                    stroke="#e2e8f0"
                    strokeWidth="3.5"
                  />
                  {segments.map((segment) => (
                    <circle
                      key={segment.type}
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="transparent"
                      stroke={segment.color}
                      strokeWidth="3.5"
                      strokeDasharray={`${segment.percent} ${100 - segment.percent}`}
                      strokeDashoffset={100 - segment.startOffset}
                      strokeLinecap="butt"
                    />
                  ))}
                </svg>
              )}
            </div>
            <div className="space-y-2 text-sm">
              {segments.length === 0 ? (
                <p className="text-sm text-slate-500">Sem dados.</p>
              ) : (
                segments.map((segment) => (
                  <div key={segment.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      />
                      <span>{segment.type}</span>
                    </div>
                    <span className="font-medium">{segment.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold">Tempo medio para resolver</h2>
          <p className="mt-4 text-3xl font-semibold">
            {avgHours}h {avgRemainingMinutes}m
          </p>
          <p className="text-sm text-slate-500">Somente resolvidas no mes atual.</p>
        </div>
      </div>
    </div>
  );
}

