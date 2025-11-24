export async function giveXp(amount: number) {
  try {
    await fetch("/api/xp/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xp: amount }),
    });
  } catch (err) {
    console.error("XP update failed:", err);
  }
}