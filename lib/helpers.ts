import { OccurrenceStatus, OccurrenceType } from "@prisma/client";

export type OccurrenceFilters = {
  type?: OccurrenceType;
  status?: OccurrenceStatus;
  q?: string;
  start?: string;
  end?: string;
  page?: string;
  pageSize?: string;
};

export function startOfDayUtc(dateString: string) {
  return new Date(`${dateString}T00:00:00.000Z`);
}

export function endOfDayUtc(dateString: string) {
  return new Date(`${dateString}T23:59:59.999Z`);
}

export function startOfMonthUtc(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
}

export function endOfMonthUtc(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999));
}

export function diffHours(start: Date, end: Date) {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 36e5));
}

export function parsePagination(filters: OccurrenceFilters) {
  const page = Math.max(1, Number(filters.page || 1));
  const pageSize = Math.min(50, Math.max(5, Number(filters.pageSize || 10)));
  return { page, pageSize, skip: (page - 1) * pageSize };
}
