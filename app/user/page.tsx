"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Item {
  id: string;
  title: string;
  price: number;
  img: string;
  status?: "loading" | "on the way" | "equipped";
}

export default function UserPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<Item[]>([]);
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    // Fetch XP from backend
    fetch("/api/xp/fetch")
      .then((res) => res.json())
      .then((data) => setXp(data.xp))
      .catch(console.error);

    // Load inventory from localStorage (simulate)
    const stored = localStorage.getItem("equippedItems");
    if (stored) {
      const parsed: Item[] = JSON.parse(stored);
      setItems(parsed);
    }

    setLoading(false);
  }, [session]);

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (!session) return <p>You must be signed in</p>;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] px-6 py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">

        {/* User Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Welcome, {session.user?.name || session.user?.email}</h1>
          <p className="text-[var(--text-muted)] mt-1">{session.user?.email}</p>
        </div>

        {/* XP */}
        <div className="mb-8">
          <div className="text-sm text-[var(--text-muted)] mb-2">XP: {xp}</div>
          <div className="w-full h-4 bg-[var(--bg-panel)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((xp / 1000) * 100, 100)}%` }}
              className="h-full bg-[var(--metal-main)]"
            />
          </div>
        </div>

        {/* Inventory */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Inventory</h2>
          {items.length === 0 ? (
            <p className="text-[var(--text-muted)]">No items yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-[var(--bg-panel)] border border-[var(--border-soft)] rounded-xl p-4">
                  <img src={item.img} alt={item.title} className="w-full h-32 object-contain mb-2" />
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-[var(--text-muted)]">${item.price}</p>
                  {item.status && (
                    <div className="mt-1 text-xs font-medium text-[var(--text-main)]">
                      {item.status}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <Link href="/xp" className="btn-lux px-6 py-2">
            XP Page
          </Link>
          <button onClick={() => signOut()} className="btn-lux-ghost px-6 py-2">
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}