import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    // Fetch checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Invalid Stripe session" },
        { status: 404 }
      );
    }

    // Example: store successful payment in DB
    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        amountTotal: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        paymentStatus: session.payment_status ?? "unknown",
        email: session.customer_details?.email || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment recorded successfully",
      session_id: session.id,
    });
  } catch (err: any) {
    console.error("Payment success route error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}