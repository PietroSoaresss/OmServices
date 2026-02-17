import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listOccurrences, createOccurrence } from "@/lib/occurrences";
import { occurrenceCreateSchema } from "@/lib/zod";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await listOccurrences(Object.fromEntries(request.nextUrl.searchParams), {
    userId: session.user.id,
    isAdmin: session.user.role === "ADMIN"
  });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = occurrenceCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.errors[0]?.message || "Invalid" }, { status: 400 });
  }

  const created = await createOccurrence(parsed.data, session.user.id);
  return NextResponse.json(created, { status: 201 });
}


