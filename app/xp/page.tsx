"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import AuthButtons from "@/components/AuthButtons";

interface Item {
  id: string;
  title: string;
  price: number;
  img: string;
  status?: "loading" | "on the way" | "equipped";
  equipped?: boolean;
}

export default function XPPage() {
  const pathname = usePathname();
  const { data: session, status } = useSession({ required: false });

  const [xp, setXp] = useState<number>(0);
  const [items, setItems] = useState<Item[]>([]);
  const [xpLoaded, setXpLoaded] = useState(false);

  const XP_MAX = 1000;

  // ✅ Load user XP from backend
  useEffect(() => {
    if (!session) return;

    async function loadXp() {
      try {
        const res = await fetch("/api/user/xp");
        const data = await res.json();
        if (data?.xp !== undefined) setXp(data.xp);
      } catch (err) {
        console.error("Failed to load XP:", err);
      } finally {
        setXpLoaded(true);
      }
    }

    loadXp();
  }, [session]);

  // ✅ Load user inventory from backend
  useEffect(() => {
    if (!session) return;

    async function loadInventory() {
      try {
        const res = await fetch("/api/inventory/list", { cache: "no-store" });
        const data = await res.json();
        if (!Array.isArray(data.inventory)) return;

        const mapped = data.inventory.map((i: any) => ({
          id: i.id,
          title: i.itemName,
          price: i.price,
          img: i.imageUrl,
          status: i.equipped ? "equipped" : undefined,
          equipped: i.equipped,
        }));

        setItems(mapped);
      } catch (err) {
        console.error("Failed to load inventory:", err);
        setItems([]);
      }
    }

    loadInventory();
  }, [session]);

  const progressWidth =
    xpLoaded && xp !== null ? `${Math.min((xp / XP_MAX) * 100, 100)}%` : "0%";

  return (
    <div className="relative flex flex-col min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] overflow-hidden">

      {/* Soft luxury backdrop gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-gradient-to-b from-[var(--bg-section)]/30 to-[var(--bg-base)]"
      />

      {/* Floating metallic aura */}
      <motion.div
        animate={{ opacity: [0.05, 0.12, 0.05], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-[900px] h-[900px] bg-[var(--aura)] rounded-full blur-3xl top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"
      />

      {/* NAV */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="absolute top-0 left-0 w-full z-30 border-b border-[var(--border-soft)] bg-[var(--bg-base)]/80 backdrop-blur"
      >
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3 hover-grow">
            <motion.img
              whileHover={{ rotate: 6, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              src="/wolf-head.png"
              alt="Wolf"
              className="w-9 h-9 object-contain opacity-90"
            />
            <div className="upperwide text-xs text-[var(--text-muted)] metal-underline">
              Wolf St.
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs upperwide text-[var(--text-muted)]">
            {["home", "armory", "inventory", "xp"].map((p) => (
              <Link
                key={p}
                href={`/${p}`}
                className={`metal-underline transition ${
                  pathname === `/${p}`
                    ? "text-[var(--metal-main)] font-semibold"
                    : "hover:text-[var(--metal-main)]"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Header */}
      <header className="relative z-10 mt-28 flex flex-col items-center text-center px-6">
        <motion.img
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          src="/wolf-head.png"
          alt="Wolf Emblem"
          className="w-[150px] h-auto opacity-90 hover-grow"
        />
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-6 text-3xl md:text-4xl font-medium tracking-wider text-[var(--text-main)]"
        >
          WOLF ST ACCESS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-3 text-[var(--text-muted)] max-w-xl"
        >
          Secure entry to your Wolf St account — sync progression, claim XP, and access drops.
        </motion.p>
      </header>

      {/* ACCESS CARD */}
      <main className="relative z-10 mt-12 w-full px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mx-auto max-w-md"
        >
          <div className="bg-[var(--bg-section)] border border-[var(--border-soft)] rounded-2xl p-8 shadow-[0_20px_40px_var(--shadow)] backdrop-blur-xl">

            {!session ? (
              <>
                <p className="text-sm text-[var(--text-muted)] mb-6">
                  Authenticate to access your profile and claim rewards.
                </p>
                <AuthButtons />
                <p className="text-xs text-[var(--text-muted)] mt-4">
                  By signing in you agree to Wolf St terms. Your session will persist across devices.
                </p>
              </>
            ) : (
              <div className="flex flex-col gap-6 items-center">

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[var(--text-muted)] text-center"
                >
                  Welcome back,{" "}
                  <span className="font-semibold text-[var(--text-main)]">
                    {session.user?.name || session.user?.email}
                  </span>
                </motion.p>

                {/* XP BAR */}
                <div className="w-full hover-grow">
                  <div className="text-xs text-[var(--text-muted)] mb-2">XP</div>
                  <div className="capsule w-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: progressWidth }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-[var(--metal-main)]"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-[var(--text-muted)]">
                    <span>{xp ?? 0} XP</span>
                    <span>{XP_MAX}</span>
                  </div>
                </div>

                {/* INVENTORY SUMMARY */}
                <div className="w-full mt-6">
                  <div className="text-xs text-[var(--text-muted)] mb-2">Inventory</div>
                  <ul className="space-y-2">
                    {items.length === 0 && (
                      <li className="text-[var(--text-muted)]">No items yet.</li>
                    )}
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between text-sm text-[var(--text-main)] bg-[var(--bg-panel)]/50 p-2 rounded-lg"
                      >
                        <span>{item.title}</span>
                        <span className="capitalize">{item.status || "loading"}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="btn-lux-ghost px-5 py-2 rounded-xl"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    logout
                  </motion.button>

                  <Link href="/inventory" className="hover-grow">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="btn-lux px-6 py-2"
                    >
                      view inventory
                    </motion.button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <p className="text-center text-[var(--text-muted)] text-xs mt-12 mb-12 tracking-widest">
        WOLF ST® ACCESS NETWORK — PRIVATE
      </p>
    </div>
  );
}