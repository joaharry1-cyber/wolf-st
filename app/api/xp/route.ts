import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { xpToAdd } = await req.json();

    if (typeof xpToAdd !== "number") {
      return NextResponse.json({ error: "Invalid XP value" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xpToAdd },
      },
    });

    return NextResponse.json({ success: true, xp: updatedUser.xp });
  } catch (err) {
    console.error("XP add error:", err);
    return NextResponse.json({ error: "Failed to add XP" }, { status: 500 });
  }
}