"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    // --- NEW: tell backend to add items + xp ---
    if (sessionId) {
      fetch("/api/payment/success", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      }).catch(() => {
        console.error("Failed to notify backend");
      });
    }

    // --- YOUR ORIGINAL LOCAL DELIVERY SIMULATION ---
    const stored = localStorage.getItem("equippedItems");
    if (stored) {
      const parsed = JSON.parse(stored);

      const updated = parsed.map((item: any) =>
        !item.status ? { ...item, status: "on the way" } : item
      );

      localStorage.setItem("equippedItems", JSON.stringify(updated));
    }

    // --- Redirect to inventory after animation ---
    const timer = setTimeout(() => {
      router.push("/inventory");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router, sessionId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="text-green-400 text-6xl mb-6"
      >
        ✓
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-2"
      >
        Payment Successful
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-neutral-400"
      >
        Preparing your items for delivery...
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-sm text-neutral-500"
      >
        You’ll be redirected to your inventory shortly.
      </motion.div>
    </div>
  );
}