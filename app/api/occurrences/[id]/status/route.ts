import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { occurrenceStatusSchema } from "@/lib/zod";
import { setOccurrenceStatus } from "@/lib/occurrences";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = occurrenceStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.errors[0]?.message || "Invalid" }, { status: 400 });
  }

  const updated = await setOccurrenceStatus(params.id, parsed.data.status);
  return NextResponse.json(updated);
}


