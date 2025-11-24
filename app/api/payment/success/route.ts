import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import authConfig from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const userSession = await getServerSession(authConfig);
    if (!userSession?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Extract item IDs from metadata
    const itemIds: string[] = JSON.parse(session.metadata?.item_ids || "[]");

    if (!itemIds.length) {
      return NextResponse.json({ error: "No items found in session" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userSession.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add each item to inventory
    for (const id of itemIds) {
      await prisma.inventory.create({
        data: {
          userId: user.id,
          itemName: id,
          price: 0, // actual price not needed in DB anymore
          imageUrl: "",
          printifyId: id,
          equipped: false,
        },
      });
    }

    // Add XP (simple version: 1 XP per $1)
    const amountTotal = session.amount_total ?? 0;
    const earnedXp = Math.round(amountTotal / 100);

    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: earnedXp } },
    });

    return NextResponse.json({ success: true, earnedXp });
  } catch (err: any) {
    console.error("Payment success error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}