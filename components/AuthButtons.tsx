"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { FaGoogle, FaDiscord } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function AuthButtons() {
  const providers = [
    { id: "google", label: "sign in with google", icon: <FaGoogle /> },
    { id: "discord", label: "sign in with discord", icon: <FaDiscord /> },
    { id: "email", label: "sign in with email", icon: <MdEmail /> },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {providers.map((p) => (
        <motion.button
          key={p.id}
          onClick={() => signIn(p.id, { callbackUrl: "/xp" })} // <-- redirect here
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="
            group relative flex items-center justify-between
            w-full px-5 py-3 rounded-xl cursor-pointer
            uppercase tracking-wide text-xs
            bg-[var(--bg-base)]/40
            border border-[var(--border-soft)]
            backdrop-blur-sm
            transition-all duration-300
            hover:border-[var(--metal-main)]/40
            hover:shadow-[0_0_18px_var(--aura)]
          "
        >
          <span className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors duration-200">
            {p.label}
          </span>
          <span className="text-[var(--text-muted)] text-lg group-hover:text-[var(--text-main)] transition-colors duration-200">
            {p.icon}
          </span>
          <span
            className="
              pointer-events-none absolute bottom-0 left-0 h-[1px] w-0 
              bg-[var(--metal-main)] transition-all duration-300 
              group-hover:w-full
            "
          />
        </motion.button>
      ))}
    </div>
  );
}