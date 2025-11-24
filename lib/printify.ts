import fetch from "node-fetch";

const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY!;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID!;

const BASE_URL = `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}`;

export async function getPrintifyProducts() {
  const response = await fetch(`${BASE_URL}/products.json`, {
    headers: {
      Authorization: `Bearer ${PRINTIFY_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Printify API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}