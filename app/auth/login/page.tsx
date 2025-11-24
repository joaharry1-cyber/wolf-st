"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md p-8 bg-neutral-900/60 border border-cyan-500/30 rounded-2xl shadow-lg text-center"
      >
        <h1 className="text-3xl font-bold text-cyan-400 mb-6 tracking-widest">
          WOLF ST. LOGIN
        </h1>

        <p className="text-neutral-400 mb-8 text-sm">
          Sign in to earn XP and claim your armor.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => signIn("google")}
            className="w-full py-3 bg-white text-neutral-900 rounded-full font-semibold hover:bg-neutral-200 transition"
          >
            Continue with Google
          </button>

          <button
            onClick={() => signIn("discord")}
            className="w-full py-3 bg-[#5865F2] rounded-full font-semibold hover:bg-[#4752C4] transition"
          >
            Continue with Discord
          </button>

          <button
            onClick={() => signIn("email")}
            className="w-full py-3 border border-cyan-500/40 text-cyan-400 rounded-full font-semibold hover:bg-cyan-400 hover:text-neutral-900 transition"
          >
            Sign in with Email (Magic Link)
          </button>
        </div>
      </motion.div>
    </div>
  );
}