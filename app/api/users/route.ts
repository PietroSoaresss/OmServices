import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createUserSchema } from "@/lib/zod";
import { createUser } from "@/lib/users";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.errors[0]?.message || "Invalid" }, { status: 400 });
  }

  try {
    const created = await createUser(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Email already in use" }, { status: 409 });
  }
}


