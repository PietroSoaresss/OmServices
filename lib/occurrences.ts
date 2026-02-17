import { OccurrenceStatus, OccurrenceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { OccurrenceFilters, startOfDayUtc, endOfDayUtc, parsePagination } from "@/lib/helpers";

export async function listOccurrences(
  rawFilters: Record<string, string | string[] | undefined>,
  options?: { userId?: string; isAdmin?: boolean }
) {
  const filters: OccurrenceFilters = {
    type: typeof rawFilters.type === "string" ? (rawFilters.type as OccurrenceType) : undefined,
    status: typeof rawFilters.status === "string" ? (rawFilters.status as OccurrenceStatus) : undefined,
    q: typeof rawFilters.q === "string" ? rawFilters.q : undefined,
    start: typeof rawFilters.start === "string" ? rawFilters.start : undefined,
    end: typeof rawFilters.end === "string" ? rawFilters.end : undefined,
    page: typeof rawFilters.page === "string" ? rawFilters.page : undefined,
    pageSize: typeof rawFilters.pageSize === "string" ? rawFilters.pageSize : undefined
  };

  const { page, pageSize, skip } = parsePagination(filters);
  const where: Record<string, unknown> = {};
  const isAdmin = options?.isAdmin === true;

  if (!isAdmin && options?.userId) {
    where.createdById = options.userId;
  }

  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } }
    ];
  }
  if (filters.start || filters.end) {
    where.createdAt = {
      ...(filters.start ? { gte: startOfDayUtc(filters.start) } : {}),
      ...(filters.end ? { lte: endOfDayUtc(filters.end) } : {})
    };
  }

  const [items, total] = await Promise.all([
    prisma.occurrence.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { createdBy: { select: { name: true, email: true } } }
    }),
    prisma.occurrence.count({ where })
  ]);

  const serialized = items.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    resolvedAt: item.resolvedAt ? item.resolvedAt.toISOString() : null
  }));

  return {
    items: serialized,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

export async function createOccurrence(
  data: { title: string; description: string; type: OccurrenceType; location?: string | null },
  userId: string
) {
  return prisma.occurrence.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      location: data.location || null,
      status: "ABERTA",
      createdById: userId
    }
  });
}

export async function setOccurrenceStatus(id: string, status: OccurrenceStatus) {
  return prisma.occurrence.update({
    where: { id },
    data: {
      status,
      resolvedAt: status === "RESOLVIDA" ? new Date() : null
    }
  });
}
