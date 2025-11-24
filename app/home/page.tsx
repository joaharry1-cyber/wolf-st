"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function HomePage() {
  const pathname = usePathname();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)]">

      {/* Luxury Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-transparent to-black/20" />

      {/* Metallic Aura */}
      <motion.div
        animate={{ opacity: [0.14, 0.25, 0.14] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[900px] h-[900px] bg-[var(--brand-metal)]/18 rounded-full blur-[150px] top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"
      />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-30 border-b border-[var(--border-soft)] bg-[var(--bg-base)]/60 backdrop-blur-2xl shadow-[0_4px_25px_-8px_rgba(0,0,0,0.25)]">
        <div className="max-w-7xl mx-auto px-10 py-6 flex items-center justify-end">
          <div className="flex items-center gap-10 text-[var(--text-secondary)] uppercase tracking-wider text-sm">
            {["home", "armory", "inventory", "xp"].map((page) => {
              const active = pathname === `/${page}`;
              return (
                <Link
                  key={page}
                  href={`/${page}`}
                  className={`transition font-medium ${
                    active
                      ? "text-[var(--brand-metal-dark)] drop-shadow-[0_0_12px_var(--brand-metal)/40]"
                      : "hover:text-[var(--brand-metal)] hover:drop-shadow-[0_0_10px_var(--brand-metal)/25]"
                  }`}
                >
                  {page}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center mt-28"
      >
        {/* Logo Float */}
        <motion.img
          src="/wolf-head.png"
          alt="Wolf Emblem"
          className="max-w-[440px] w-4/5 h-auto object-contain drop-shadow-[0_0_18px_rgba(255,255,255,0.08)]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-10 text-4xl md:text-6xl font-semibold tracking-[0.24em] text-[var(--text-main)] uppercase"
        >
          WOLF ST.
        </motion.h1>

        {/* Tagline */}
        <p className="mt-5 text-[var(--text-secondary)] tracking-[0.12em] text-sm md:text-base">
          Premium Apparel • Elevated Identity
        </p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="mt-14"
        >
          <Link href="/armory">
            <motion.button
              whileHover={{
                scale: 1.06,
                boxShadow: "0 0 28px rgba(180,170,160,0.45)",
              }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-4 px-10 py-3.5 rounded-full border border-[var(--brand-metal)] bg-[var(--bg-panel)]/60 backdrop-blur-xl 
              text-[var(--text-main)] hover:bg-[var(--bg-section)]/60 transition font-medium tracking-wide"
            >
              Enter Armory
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Texture Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
    </div>
  );
}