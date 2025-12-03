"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Item {
id: string;
title: string;
description: string;
price: number;
img: string;
rarity: string;
xp: number;
}

export default function ArmoryPage() {
const [items, setItems] = useState<Item[]>([]);
const [loading, setLoading] = useState(true);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);
const [inventoryLoading, setInventoryLoading] = useState<Item[]>([]);
const [recentlyAdded, setRecentlyAdded] = useState<Item | null>(null);

useEffect(() => {
async function fetchItems() {
try {
const res = await fetch("/api/printify-products");
const data = await res.json();

    setItems(
      data.map((p: any) => ({
        ...p,
        rarity: "Common Drop",
        xp: 10, // <-- Updated from 0 to 10
      }))
    );
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

fetchItems();

}, []);

const handleEquip = (item: Item) => {
setInventoryLoading((prev) => [...prev, item]);
setSelectedItem(null);
setRecentlyAdded(item);

try {
  const raw = localStorage.getItem("equippedItems");
  const current: Item[] = raw ? JSON.parse(raw) : [];

  const newList = [
    ...current,
    {
      id: item.id,
      title: item.title,
      price: item.price,
      img: item.img,
      rarity: item.rarity,
      xp: item.xp,
      description: item.description,
      status: "loading",
    },
  ];

  localStorage.setItem("equippedItems", JSON.stringify(newList));
} catch (e) {
  console.error("Failed to save equipped item", e);
}

setTimeout(() => {
  setInventoryLoading((prev) => prev.filter((i) => i.id !== item.id));
  setRecentlyAdded(null);
}, 3000);

};

if (loading) {
return (
<div className="flex items-center justify-center min-h-screen text-[#BBA894] tracking-widest">
Loading Armory...
</div>
);
}

return (
<div className="relative flex flex-col min-h-screen overflow-hidden bg-[#F7F5F2] text-[#1A1A1A]">

  {/* NAVBAR */}
  <nav className="absolute top-0 left-0 w-full z-30 border-b border-[#E8E2DA] bg-[#F7F5F2]/70 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-10 py-6 flex items-center justify-between text-sm tracking-widest text-[#7C7166]">
      <div className="text-xl font-semibold tracking-[0.22em] text-[#1A1A1A]">
        WOLF ST.
      </div>
      <div className="flex items-center gap-10">
        <Link href="/home" className="hover:text-[#BBA894] transition">Home</Link>
        <Link href="/armory" className="text-[#BBA894] font-semibold transition">Armory</Link>
        <Link href="/inventory" className="hover:text-[#BBA894] transition">Inventory</Link>
        <Link href="/xp" className="hover:text-[#BBA894] transition">XP</Link>
      </div>
    </div>
  </nav>

  {/* Page Header */}
  <motion.h1
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="relative z-10 mt-32 text-center text-5xl font-light tracking-[0.25em] text-[#1A1A1A]"
  >
    ARMORY
  </motion.h1>

  {/* Items Grid */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 1 }}
    className="relative z-10 mt-20 max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14"
  >
    {items.map((item) => (
      <motion.div
        key={item.id}
        whileHover={{ scale: 1.015 }}
        className="bg-white border border-[#E8E2DA] rounded-2xl p-6 shadow-[0_6px_16px_rgba(215,198,178,0.12)] hover:shadow-[0_10px_22px_rgba(215,198,178,0.18)] cursor-pointer transition-all flex flex-col"
        onClick={() => setSelectedItem(item)}
      >
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-48 object-contain mb-5"
        />

        <h2 className="text-lg font-medium tracking-wide">{item.title}</h2>

        <div className="mt-4 border-t border-[#EFE9E0] pt-3 text-xs text-[#7C7166] tracking-widest flex justify-between">
          <span>{item.rarity}</span>
          <span>{item.xp} XP</span>
        </div>
      </motion.div>
    ))}
  </motion.div>

  {/* Popup Modal */}
  <AnimatePresence>
    {selectedItem && (
      <motion.div
        key="selectedItem"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl p-10 w-full max-w-md border border-[#E8E2DA] shadow-xl text-center"
        >
          <img
            src={selectedItem.img}
            alt={selectedItem.title}
            className="w-56 h-56 object-contain mx-auto"
          />

          <h2 className="mt-6 text-2xl font-semibold tracking-wide">{selectedItem.title}</h2>

          <p className="text-[#BBA894] mt-1 tracking-wider">{selectedItem.rarity}</p>

          {/* Updated Description Rendering */}
          <div
            className="text-[#7C7166] mt-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedItem.description }}
          />

          <p className="text-[#1A1A1A] mt-3 font-semibold">
            ${selectedItem.price} — {selectedItem.xp} XP
          </p>

          <button
            onClick={() => handleEquip(selectedItem)}
            className="mt-6 w-full py-3 rounded-xl bg-[#F7F5F2] border border-[#CBBBA6] text-[#1A1A1A] font-medium hover:bg-[#EFE9E0] transition"
          >
            Equip
          </button>

          <button
            onClick={() => setSelectedItem(null)}
            className="mt-3 text-sm text-[#7C7166] hover:text-[#BBA894] transition"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Inventory Loading Notification */}
  <AnimatePresence>
    {recentlyAdded && (
      <motion.div
        key="loadingPopup"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-6 right-6 bg-white/95 backdrop-blur-xl px-6 py-4 rounded-xl border border-[#E8E2DA] shadow-xl z-50"
      >
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-[#BBA894] font-semibold tracking-wider"
        >
          Loading to Inventory...
        </motion.p>

        <p className="mt-1 text-[#1A1A1A] text-sm tracking-widest">
          {recentlyAdded.rarity}:{" "}
          <span className="text-[#BBA894]">{recentlyAdded.title}</span>
        </p>
      </motion.div>
    )}
  </AnimatePresence>
</div>

);
}