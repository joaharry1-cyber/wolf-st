import dotenv from "dotenv";
dotenv.config();

async function testPrintify() {
  const apiKey = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!apiKey || !shopId) {
    console.error("❌ Missing Printify credentials in .env");
    return;
  }

  console.log("🧪 Testing Printify connection...");

  const response = await fetch(`https://api.printify.com/v1/shops.json`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    console.error("❌ Printify API Error:", response.statusText);
    return;
  }

  const data = await response.json();
  console.log("✅ Printify connection successful!");
  console.log("Shop info:", data);
}

testPrintify();