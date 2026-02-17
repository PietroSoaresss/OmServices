import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonthUtc, endOfMonthUtc, diffHours } from "@/lib/helpers";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

  const avgHours = resolvedMonth.length
    ? Math.round(
        resolvedMonth.reduce((sum, item) => sum + diffHours(item.createdAt, item.resolvedAt!), 0) /
          resolvedMonth.length
      )
    : 0;

  return NextResponse.json({
    totalMonth,
    totalOpen,
    totalResolved,
    typeCounts,
    avgHours
  });
}


