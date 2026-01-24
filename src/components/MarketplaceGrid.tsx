"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";

interface MarketItem {
  id: string;
  seller_name: string;
  product_name: string;
  product_image: string;
  whatsapp_link: string;
  expires_at: string;
  remainingTime?: string; // New property for countdown
}

export default function MarketplaceGrid() {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveItems();
    const interval = setInterval(() => {
      updateRemainingTimes();
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  async function fetchActiveItems() {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("marketplace")
      .select("*")
      .gt("expires_at", now)
      .order("created_at", { ascending: false });

    if (data) {
      const updatedData = data.map((item) => ({
        ...item,
        remainingTime: calculateRemainingTime(item.expires_at),
      }));
      setItems(updatedData);
    }
    setLoading(false);
  }

  function updateRemainingTimes() {
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        remainingTime: calculateRemainingTime(item.expires_at),
      }))
    );
  }

  function calculateRemainingTime(expiresAt: string): string {
    const now = new Date();
    const expiration = new Date(expiresAt);
    const diff = expiration.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  // Sub-component for individual timers
  function CountdownBadge({ expiresAt }: { expiresAt: string }) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
      const updateTimer = () => {
        const now = new Date().getTime();
        const expiration = new Date(expiresAt).getTime();
        const distance = expiration - now;

        if (distance < 0) {
          setTimeLeft("EXPIRED");
          return;
        }

        // Calculate hours and minutes
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft(`${hours}h ${minutes}m`);
      };

      // Run immediately then every minute (or second if you prefer)
      updateTimer();
      const interval = setInterval(updateTimer, 60000); // Updates every minute

      return () => clearInterval(interval);
    }, [expiresAt]);

    return (
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[9px] font-bold px-2 py-1 rounded-full border border-white/10">
        ⏱ {timeLeft}
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="py-20 text-center bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-700">
        <h3 className="text-2xl font-black text-white italic mb-2">NO ACTIVE FREEBIES</h3>
        <p className="text-slate-400 text-sm mb-6">Be the first to upload your product for free (24hrs only).</p>
        <Link href="/upload" className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-black text-xs uppercase hover:bg-yellow-400 transition">
          POST MY ITEM NOW →
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-1 flex-1 bg-white/10"></div>
        <h2 className="text-2xl font-black text-white italic uppercase">
          Daily <span className="text-yellow-500">Freebies</span> (24h)
        </h2>
        <div className="h-1 flex-1 bg-white/10"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-500/50 transition-all"
          >
            <CountdownBadge expiresAt={item.expires_at} />

            <div className="h-40 bg-slate-800 overflow-hidden">
              <img
                src={item.product_image}
                alt={item.product_name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            <div className="p-4">
              <h3 className="text-white font-bold text-sm truncate">{item.product_name}</h3>
              <p className="text-slate-500 text-[10px] uppercase font-bold mb-4">{item.seller_name}</p>

              <a
                href={item.whatsapp_link}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-emerald-600/20 text-emerald-500 border border-emerald-600/30 py-2 rounded-lg text-[10px] font-black hover:bg-emerald-600 hover:text-white transition"
              >
                CHAT SELLER 💬
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}