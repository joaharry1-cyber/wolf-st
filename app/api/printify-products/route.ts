import { NextResponse } from "next/server";

const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY!;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID!;

export async function GET() {
  try {
    const res = await fetch(
      `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products.json`,
      {
        headers: {
          Authorization: `Bearer ${PRINTIFY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Printify API error", detail: text },
        { status: res.status }
      );
    }

    const json = await res.json();
    const products = json.data || []; // <-- Extract the products array

    const items = products.map((p: any) => ({
      id: p.id,
      title: p.title,
      price: (p.variants?.[0]?.price || 0) / 100, // cents → USD
      img: p.images?.[0]?.src || "/placeholder.png",
      description: p.description || "",
    }));

    return NextResponse.json(items); // Only return array, not the wrapper object
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}