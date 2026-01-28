"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// --- TYPES FOR DATABASE CONTENT ---
type Post = {
  id: string;
  title: string;
  category: string;
  summary: string;
  author: string;
  link?: string;
  is_sponsored: boolean;
  created_at: string;
};

// --- STATIC DATA ---
const tickerNews = [
  "BREAKING: Bitcoin hits new all-time high amid regulatory talks...",
  "POLITICS: Senate approves new install mental housing bill...",
  "TECH: Apple announces AI partnership with OpenAI...",
  "SPORTS: Nigeria qualifies for 2026 World Cup finals...",
];

const categories = ["All", "Politics", "Real Estate", "Crypto", "Tech", "Sports", "Entertainment", "Finance"];

const globalNews = [
  { category: "Geopolitics", title: "UN Summit: Nations Agree on New AI Safety Protocols", color: "bg-blue-500" },
  { category: "Economy", title: "Asian Markets Rally as Tech Stocks Hit All-Time Highs", color: "bg-emerald-500" },
  { category: "Climate", title: "Renewable Energy Output Surpasses Coal for First Time", color: "bg-green-500" }
];

export default function Home() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // --- DYNAMIC STATE (Live Data) ---
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [heroPost, setHeroPost] = useState<Post | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA FROM SUPABASE ---
  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
      } else if (data) {
        setAllPosts(data as Post[]);
        // Find the Sponsored Post for the Hero
        const sponsored = data.find((post: any) => post.is_sponsored === true);
        if (sponsored) setHeroPost(sponsored as Post);
      }
      setLoading(false);
    }

    fetchNews();
  }, []);

  // --- FILTER LOGIC (Search + Category) ---
  useEffect(() => {
    let filtered = allPosts;

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (post) => post.category && post.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.summary?.toLowerCase().includes(query) ||
          post.category?.toLowerCase().includes(query)
      );
    }

    // Exclude sponsored posts from the list (they're in hero)
    filtered = filtered.filter((post) => !post.is_sponsored);

    setFilteredPosts(filtered);
  }, [activeCategory, searchQuery, allPosts]);

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden relative selection:bg-cyan-500 selection:text-black font-sans">

      {/* --- LIVE TICKER (Sticky Top) --- */}
      <div className="bg-yellow-500 text-black text-xs font-bold py-2 overflow-hidden whitespace-nowrap relative z-50">
        <motion.div
          className="inline-block"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {tickerNews.map((item, i) => (
            <span key={i} className="mx-8">🔴 {item}</span>
          ))}
        </motion.div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="relative z-20 flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0">
        <div className="text-2xl font-black italic tracking-tighter cursor-pointer" onClick={() => router.push('/')}>
          BEACON<span className="text-[#00B2FF]">PRESS</span>
        </div>

        <div className="hidden md:flex items-center bg-[#1E293B] rounded-full px-4 py-2 border border-white/10 w-96">
          <span className="text-slate-400 mr-2">🔍</span>
          <input
            type="text"
            placeholder="Search politics, crypto, land..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500"
          />
        </div>

        <button 
          onClick={() => router.push('/admin/login')}
          className="bg-white/10 text-white px-5 py-2 rounded-lg font-bold hover:bg-white/20 transition-all border border-white/10 text-sm"
        >
          Sign In
        </button>
      </nav>

      {/* --- CATEGORY FILTER BAR --- */}
      <div className="flex gap-2 px-6 py-4 overflow-x-auto border-b border-white/5 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat
              ? "bg-[#00B2FF] text-black"
              : "bg-[#1E293B] text-slate-400 hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* --- MAIN GRID (Hero + Sidebar) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

          {/* LEFT COLUMN: HERO SECTION */}
          <div className="lg:col-span-2 group cursor-pointer">
            {loading ? (
              // SKELETON LOADER (While fetching)
              <div className="h-[350px] w-full bg-white/5 animate-pulse rounded-2xl flex items-center justify-center">
                <p className="text-slate-500 text-sm">Loading Headlines...</p>
              </div>
            ) : heroPost ? (
              // REAL DATA FROM SUPABASE
              <>
                <div className="relative h-[350px] w-full rounded-2xl overflow-hidden mb-4 border border-white/10 group-hover:border-[#00B2FF] transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#00B2FF]/20"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black via-black/90 to-transparent">

                    {/* SPONSOR LABEL */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest rounded-sm">
                        Premium Sponsor
                      </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B2FF] to-[#D033FF] font-black text-sm uppercase tracking-wider">
                        {heroPost.author}
                      </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black leading-tight mb-2 text-white group-hover:text-[#00B2FF] transition-colors">
                      {heroPost.title}
                    </h1>

                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span>Posted just now</span>
                      <span>•</span>
                      <span className="text-yellow-400 font-bold">Verified Listing ✅</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-400 text-lg leading-relaxed mb-4 line-clamp-3">
                  {heroPost.summary}
                </p>

                <a
                  href={`/posts/${heroPost.id}`}
                  className="inline-flex items-center text-[#00B2FF] font-bold hover:underline decoration-2 underline-offset-4 text-sm"
                >
                  Read Full Story →
                </a>
              </>
            ) : (
              // FALLBACK IF NO DATA
              <div className="p-10 text-center border border-white/10 rounded-xl">
                <p className="text-slate-400">No sponsored news available right now.</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: TRENDING LIST (Real Data) */}
          <div className="lg:col-span-1 border-l border-white/10 lg:pl-8 flex flex-col gap-6">
            <h3 className="font-black text-xl text-slate-500 uppercase tracking-widest">
              {searchQuery ? `Search Results (${filteredPosts.length})` : 'Trending Now'}
            </h3>

            {loading ? (
              <p className="text-slate-500 text-sm">Updating feed...</p>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.slice(0, 8).map((item) => (
                <a key={item.id} href={`/posts/${item.id}`} className="group cursor-pointer border-b border-white/5 pb-4 last:border-0 hover:opacity-80 transition">
                  <span className="text-[10px] font-bold text-[#00B2FF] uppercase mb-1 block">
                    {item.category || 'Uncategorized'}
                  </span>
                  <h4 className="text-md font-bold leading-snug group-hover:text-[#00B2FF] transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                </a>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No posts found. Try a different search or category.</p>
            )}

            {/* NATIVE AD SLOT (Text Link - Keep Static) */}
            <div className="bg-[#1E293B]/50 p-4 rounded-xl border border-yellow-500/20 mt-4">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">
                Ad • Ay'Smart Investment Ltd
              </p>
              <a href="https://www.aysmartinvestmentltd.com" target="_blank" className="text-sm font-bold text-white hover:text-yellow-400 transition">
                Need a car? Swap your old model for a 2026 upgrade today. No hidden fees.
              </a>
            </div>
          </div>
        </div>

        {/* --- NEWSLETTER HOOK --- */}
        <section className="w-full bg-gradient-to-r from-[#00B2FF] to-[#D033FF] rounded-2xl p-0.5 mb-16">
          <div className="bg-[#020617] rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-white mb-2">Don't Miss the Next Big Move</h3>
              <p className="text-slate-400 text-sm">Get daily alerts on market trends, viral hits, and property deals.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#00B2FF] w-full md:w-64 text-sm"
              />
              <button className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-slate-200 transition text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* --- GLOBAL PULSE (Static Grid) --- */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <h3 className="text-2xl font-black">Global Pulse</h3>
            <button className="text-xs font-bold text-[#00B2FF] uppercase hover:underline">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {globalNews.map((news, i) => (
              <div key={i} className="group cursor-pointer">
                <div className={`h-40 w-full rounded-xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity ${news.color}`}></div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{news.category}</span>
                  <span className="text-[10px] text-slate-500">• 10 mins ago</span>
                </div>
                <h4 className="text-lg font-bold leading-tight group-hover:text-[#00B2FF] transition">
                  {news.title}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/10 pt-12 pb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-black italic tracking-tighter">
              BEACON<span className="text-[#00B2FF]">PRESS</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-400 font-medium">
              <a href="#" className="hover:text-white">About</a>
              <a href="#" className="hover:text-white">Advertise</a>
              <a href="#" className="hover:text-white">Privacy</a>
            </div>
            <div className="text-xs text-slate-600">
              Sponsored by <span className="text-slate-400 font-bold">Ay'Smart Investment Ltd</span>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}