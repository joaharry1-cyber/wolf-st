import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const runtime = "edge"; // replaces deprecated config

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle event types here
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Checkout session completed:", session);
  }

  return NextResponse.json({ received: true });
}