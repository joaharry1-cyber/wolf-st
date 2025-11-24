import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const items = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items found" }, { status: 400 });
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.title, images: item.img ? [item.img] : [] },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    }));

    const shippingFee = 1400; // $14 -> cents
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Worldwide Shipping" },
        unit_amount: shippingFee,
      },
      quantity: 1,
    });

    const itemIds = items.map((i: any) => i.id);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/inventory`,
      metadata: { item_ids: JSON.stringify(itemIds) },
      shipping_address_collection: {
        allowed_countries: ["US","GB","AU","CA","ID","SG","MY","JP","KR","PH"],
      },
      billing_address_collection: "required",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message || "Checkout session creation failed" }, { status: 500 });
  }
}