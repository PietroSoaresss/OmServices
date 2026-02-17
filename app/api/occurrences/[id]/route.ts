import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { occurrenceUpdateSchema } from "@/lib/zod";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const item = await prisma.occurrence.findUnique({
    where: { id: params.id }
  });

  if (!item) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  if (session.user.role !== "ADMIN" && item.createdById !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = occurrenceUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.errors[0]?.message || "Invalid" }, { status: 400 });
  }

  const updated = await prisma.occurrence.update({
    where: { id: params.id },
    data: parsed.data
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await prisma.occurrence.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ ok: true });
}


