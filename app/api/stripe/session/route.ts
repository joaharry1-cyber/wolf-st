import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();

    const session = await stripe.checkout.sessions.retrieve(session_id);

    return NextResponse.json({
      status: session.payment_status,
      metadataItemIds: session.metadata?.item_ids
        ? session.metadata.item_ids.split(",")
        : [],
    });
  } catch (err) {
    console.error("Error fetching Stripe session:", err);
    return NextResponse.json({ error: "Session fetch failed" }, { status: 500 });
  }
}