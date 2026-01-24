Step 1: Create the "Brain" File (Do this once)
Create a new file in your root folder named PROJECT_STATUS.md. Copy and paste this exact content into it. This file acts as the "Memory Card" for any AI that joins the project.

File: PROJECT_STATUS.md

Markdown

# 🚀 PROJECT STATUS: Beacon Press Hub & Ay'Smart Integration

## 📌 Current Focus

We are building the **"24-Hour Freebie Marketplace"**. This is a section where users can upload products for free, and they auto-expire after 24 hours.

## ✅ Recently Completed

1. **PremiumHero.tsx**: The landscape hero section that features the "Pinned Sponsor" (Ay'Smart).
2. **BusinessShowcase.tsx**: The CEO video interview and product gallery slider.
3. **Database**: `posts` table updated for sponsorship; `marketplace` table created.

## 🚧 IMMEDIATE NEXT TASK: Build MarketplaceGrid.tsx

We need a grid component that fetches items from the `marketplace` table.

**Requirements:**

- **Filter**: Only show items where `expires_at` is in the future.
- **UI**: Grid layout. Each card shows the product image, title, and a "Chat on WhatsApp" button.
- **Empty State**: If no items exist, show a "Upload Your Free Ad" CTA.
- **Animation**: Use Framer Motion for entrance effects.

## 💾 Database Schema (Reference)

```sql
CREATE TABLE marketplace (
  id uuid PRIMARY KEY,
  seller_name text,
  product_name text,
  product_image text,
  whatsapp_link text,
  created_at timestamp,
  expires_at timestamp -- Logic: DELETE or HIDE if < NOW()
);
Step 2: The Code (24-Hour Marketplace Grid)
Here is the code for the component itself. Save this, and your "Next Task" is technically done, ready for the AI to refine or style.

File: src/components/MarketplaceGrid.tsx

TypeScript
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
}

export default function MarketplaceGrid() {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveItems();
  }, []);

  async function fetchActiveItems() {
    // 1. Fetch only items that have NOT expired
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('marketplace')
      .select('*')
      .gt('expires_at', now) // "Greater Than" Now
      .order('created_at', { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  }

  // 2. THE EMPTY STATE (If no ads exist)
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

      {/* 3. THE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-500/50 transition-all"
          >
            {/* TIMER BADGE (Optional Logic can be added here) */}
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[9px] font-bold px-2 py-1 rounded-full border border-white/10">
              ⏱ 24h
            </div>

            {/* PRODUCT IMAGE */}
            <div className="h-40 bg-slate-800 overflow-hidden">
               <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            </div>

            {/* CONTENT */}
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
