"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function PremiumHero() {
  const [sponsor, setSponsor] = useState<any>(null);

  useEffect(() => {
    const fetchSponsor = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("title, summary, image_url, link")
        .eq("is_sponsored", true)
        .single();

      if (!error) {
        setSponsor(data);
      }
    };

    fetchSponsor();
  }, []);

  if (!sponsor) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[300px] md:h-[400px] bg-slate-950 rounded-[2.5rem] relative overflow-hidden border-b-4 border-yellow-500 shadow-2xl"
    >
      {/* Background Image/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
      <img src={sponsor.image_url} className="absolute inset-0 w-full h-full object-cover" alt="Sponsor" />

      {/* Content Overlay */}
      <div className="relative z-20 p-10 h-full flex flex-col justify-center max-w-2xl">
        <span className="bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4">PREMIUM SPONSOR</span>
        <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none mb-4">
          {sponsor.title}
        </h1>
        <p className="text-slate-300 text-sm mb-8 font-medium line-clamp-2">
          {sponsor.summary}
        </p>
        <a href={sponsor.link} className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase w-fit hover:bg-yellow-500 transition">
          INVEST NOW →
        </a>
      </div>
    </motion.div>
  );
}