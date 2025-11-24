import { NextResponse } from "next/server";
import Stripe from "stripe";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // we need raw body for signature verification
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf);
  const sig = req.headers.get("stripe-signature") || "";
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!endpointSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET env var");
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed.", err.message || err);
    return NextResponse.json({ error: err.message || "Invalid signature" }, { status: 400 });
  }

  // Handle checkout complete
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const rawItemIds = session.metadata?.item_ids || "[]";
      const itemIds = JSON.parse(rawItemIds);

      // Save a tiny status file to public so frontend can poll it
      const output = {
        updatedAt: new Date().toISOString(),
        status: "on the way",
        itemIds,
      };

      // write to /public/inventory_status.json
      const filePath = path.join(process.cwd(), "public", "inventory_status.json");
      fs.writeFileSync(filePath, JSON.stringify(output), { encoding: "utf-8" });

      console.log("✅ Webhook: wrote public/inventory_status.json", output);
    } catch (e) {
      console.error("Webhook processing error:", e);
    }
  }

  return NextResponse.json({ received: true });
}