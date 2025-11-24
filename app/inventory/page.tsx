"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Item {
  id: string;
  title: string;
  price: number;
  img: string;
  rarity?: string;
  xp?: number;
  status?: "loading" | "on the way" | "equipped";
}

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [activeBubble, setActiveBubble] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("equippedItems");
    if (stored) {
      try {
        const parsed: Item[] = JSON.parse(stored);
        const deduped = Array.from(
          parsed.reduce((map, it) => map.set(it.id, it), new Map<string, Item>()).values()
        );
        setItems(deduped);
      } catch {
        setItems([]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/inventory_status.json", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted || !data || !data.itemIds) return;

        const incomingIds: string[] = data.itemIds;
        setItems((prev) => {
          const next = prev.map((it) =>
            incomingIds.includes(it.id)
              ? { ...it, status: "on the way" }
              : it
          );
          localStorage.setItem("equippedItems", JSON.stringify(next));
          return next;
        });
      } catch {}
    }, 2000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSelect = (item: Item) => {
    if (item.status === "on the way") return;
    setActiveBubble(activeBubble === item.id ? null : item.id);
  };

  const handleAddToCart = (item: Item) => {
    setSelectedItems((prev) =>
      prev.find((i) => i.id === item.id) ? prev : [...prev, item]
    );
    setActiveBubble(null);
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("No items selected!");
      return;
    }

    try {
      const ids = selectedItems.map((i) => i.id);
      sessionStorage.setItem("last_checkout_item_ids", JSON.stringify(ids));

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedItems),
      });

      if (!res.ok) {
        alert("Stripe session failed — check console.");
        return;
      }

      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error("Stripe checkout error:", err);
      alert("Failed to start checkout.");
    }
  };

  const total = selectedItems.reduce((sum, i) => sum + i.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-neutral-600 flex items-center justify-center">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-[#f7f7f7] text-black overflow-visible pb-36">
      {/* Soft luxury gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-[#f2f2f2] pointer-events-none" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-30 border-b border-neutral-200/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-10 py-6 flex items-center justify-between text-sm uppercase tracking-[0.15em] text-neutral-700">
          <div className="text-xl font-semibold tracking-wider">
            WOLF ST.
          </div>

          <div className="flex items-center gap-10">
            <a href="/home" className="hover:text-neutral-900 transition">Home</a>
            <a href="/armory" className="hover:text-neutral-900 transition">Armory</a>
            <a href="/inventory" className="text-black font-bold">Inventory</a>
            <a href="/xp" className="hover:text-neutral-900 transition">XP</a>
          </div>
        </div>
      </nav>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 mt-28 text-center text-4xl md:text-5xl font-semibold tracking-[0.25em] text-neutral-800"
      >
        INVENTORY
      </motion.h1>

      {/* Items Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative z-10 mt-16 max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-16 overflow-visible"
      >
        {items.length === 0 ? (
          <div className="col-span-full text-center text-neutral-500">
            No items equipped yet.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="relative overflow-visible z-20 pb-14">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`relative bg-white border ${
                  item.status === "on the way"
                    ? "border-neutral-400/50"
                    : "border-neutral-300/40"
                } rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition cursor-pointer overflow-visible`}
                onClick={() => handleSelect(item)}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-40 object-contain"
                />

                <h2 className="mt-4 text-lg font-medium tracking-wide text-neutral-800">
                  {item.title}
                </h2>

                <p className="text-neutral-500 mt-1 text-sm">${item.price}</p>

                {item.status && (
                  <div
                    className={`mt-3 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide ${
                      item.status === "loading"
                        ? "bg-neutral-300 text-neutral-800"
                        : item.status === "on the way"
                        ? "bg-neutral-800 text-white"
                        : "bg-neutral-900 text-white"
                    }`}
                  >
                    {item.status === "loading"
                      ? "Loading"
                      : item.status === "on the way"
                      ? "On the way"
                      : "Equipped"}
                  </div>
                )}

                {/* Luxury Bubble */}
                <AnimatePresence>
                  {activeBubble === item.id && item.status !== "on the way" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-[-55px] left-1/2 -translate-x-1/2 bg-white border border-neutral-300 rounded-full px-5 py-2 text-sm shadow-lg backdrop-blur-xl"
                    >
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="font-medium text-neutral-700 hover:text-black transition"
                      >
                        Buy ${item.price}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          ))
        )}
      </motion.div>

      {/* Checkout Button */}
      {selectedItems.length > 0 && (
        <motion.button
          onClick={handleCheckout}
          whileHover={{ scale: 1.04 }}
          className="fixed bottom-8 right-8 px-10 py-4 rounded-full bg-black text-white font-medium tracking-wide shadow-xl hover:bg-neutral-900 transition z-[99999]"
        >
          Buy {selectedItems.length} • ${total.toFixed(2)}
        </motion.button>
      )}
    </div>
  );
}