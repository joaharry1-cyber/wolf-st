import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover", // <-- UPDATED
});

// No deprecated `config` export, use new Next.js format:
export const runtime = "edge"; // optional, but avoid config warning

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    // Your webhook logic here
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe Webhook Error:", err);
    return NextResponse.json({ error: err.message || "Webhook failed" }, { status: 400 });
  }
}