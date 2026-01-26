"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPublisher() {
  const router = useRouter();
  const [post, setPost] = useState({
    title: "", 
    category: "Politics", 
    summary: "", 
    content: "",
    image_url: "", 
    author: "Beacon Admin", 
    is_sponsored: false,
    link: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin_session='));
      
      if (!token) {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const handlePublish = async () => {
    if (!post.title || !post.content) {
      setMessage("❌ Title and content are required!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.from('posts').insert([{
        ...post,
        created_at: new Date().toISOString(),
        expires_at: null
      }]);

      if (error) {
        setMessage("❌ Error: " + error.message);
      } else {
        setMessage("✅ Post published successfully! Check homepage.");
        // Reset form
        setPost({
          title: "", 
          category: "Politics", 
          summary: "", 
          content: "",
          image_url: "", 
          author: "Beacon Admin", 
          is_sponsored: false,
          link: ""
        });
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (err) {
      setMessage("❌ Publishing failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 font-sans">
      {/* TOP BAR */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter">
              BEACON<span className="text-blue-500">PRESS</span>
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Emergency Admin Command Center</p>
          </div>
        <div className="space-y-6">
          {/* TITLE INPUT */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
              📰 Headline (Required)
            </label>
            <input 
              type="text" 
              placeholder="Breaking news, analysis, or feature story..." 
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white placeholder:text-slate-600 transition"
            />
    <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">
            NEW <span className="text-blue-500">ARTICLE</span>
          </h2>
        </div>

        {/* FORM CARD */}
        <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="space-y-6">
            {/* TITLE INPUT */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Headline (Required)</label>
              <input 
                type="text" 
                placeholder="Enter article headline..." 
                value={post.title}
                className="w-full bg-black/40 p-5 rounded-2xl border border-white/5 outline-none focus:border-blue-500 text-white placeholder:text-slate-500 transition"
                onChange={e => setPost({...post, title: e.target.value})} 
              />
            </div>

          {/* CATEGORY SELECT */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
              🏷️ Category
            </label>
            <select 
              value={post.category}
              onChange={(e) => setPost({ ...post, category: e.target.value })}
              className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white transition"
            >
              <option value="Politics">Politics</option>
              <option value="Tech">Tech</option>
              <option value="Crypto">Crypto</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Sports">Sports</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          {/* SUMMARY INPUT */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
              ✍️ Summary (Optional)
            </label>
            <input 
              type="text" 
              placeholder="Brief preview for homepage..." 
              value={post.summary}
              maxLength={150}
              onChange={(e) => setPost({ ...post, summary: e.target.value })}
              className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white placeholder:text-slate-600 transition"
            />
            <p className="text-[10px] text-slate-500 mt-1">{post.summary.length}/150 chars</p>
            />
              <p className="text-[10px] text-slate-500 mt-1">{post.summary.length}/150 characters</p>
          {/* IMAGE URL */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
              🖼️ Featured Image URL (Optional)
            </label>
            <input 
              type="text" 
              placeholder="https://unsplash.com/... or https://imgbb.com/..." 
              value={post.image_url}
              onChange={(e) => setPost({ ...post, image_url: e.target.value })}
              className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white placeholder:text-slate-600 transition"
            />
            {post.image_url && (
              <div className="mt-3 relative">
                <img 
          {/* CONTENT TEXTAREA */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
              📄 Full Article Content (Required)
            </label>
            <textarea 
              placeholder="Write your complete story here... Use paragraphs for readability." 
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white placeholder:text-slate-600 h-48 resize-none transition"
            />
            <p className="text-[10px] text-slate-500 mt-1">{post.content.length} characters</p>
            )}
          {/* READ MORE LINK */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
              🔗 Read More Link (Optional)
            </label>
            <input 
              type="url" 
              placeholder="https://example.com/article..." 
              value={post.link}
              onChange={(e) => setPost({ ...post, link: e.target.value })}
              className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white placeholder:text-slate-600 transition"
            />
          </div>

          {/* STATUS MESSAGE */}
          {message && (
            <div
              className={`p-4 rounded-xl text-center font-bold text-sm ${
                message.includes("✅")
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {message}
            </div>
          )}

          {/* PUBLISH BUTTON */}
          <button 
            onClick={handlePublish}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 py-6 rounded-xl font-black text-sm uppercase tracking-widest transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30"
          >
            {loading ? "⏳ PUBLISHING..." : "🚀 PUBLISH TO HUB →"}
          </button>
        </div>
      </div>
        </div>

        {/* RIGHT COLUMN: INFO & STATS */}
        <div className="space-y-6">
          {/* TIPS CARD */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4">💡 Quick Tips</h3>
            <ul className="text-xs text-slate-400 space-y-3">
              <li className="flex gap-2">
                <span>✅</span>
                <span>Use clear, engaging headlines</span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>High-quality images (1200x630px)</span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>Keep summary under 150 chars</span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>Mark sponsor posts as Premium</span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>Posts appear instantly on hub</span>
              </li>
            </ul>
          </div>

          {/* RECENT POSTS CARD */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4">📊 Status</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Posts Published</span>
                <span className="font-black">--</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sponsored</span>
                <span className="font-black">--</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Views Today</span>
                <span className="font-black">--</span>
              </div>
            </div>
          </div>

          {/* SECURITY INFO */}
          <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">🔐 Security</p>
            <p className="text-[10px] text-red-300/70">
              Your session expires in 24 hours. Login again for continued access.
            </p>
          </div    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}>
                {message}
              </div>
            )}

            {/* PUBLISH BUTTON */}
            <button 
              onClick={handlePublish}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:from-blue-500 hover:to-blue-400 transition shadow-2xl shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "⏳ PUBLISHING..." : "🚀 PUBLISH TO HUB →"}
            </button>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="mt-10 p-6 bg-slate-900/50 rounded-2xl border border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-3">📋 Quick Tips</h3>
          <ul className="text-xs text-slate-400 space-y-2">
            <li>✅ Provide a clear, engaging headline</li>
            <li>✅ Use high-quality images (recommended: 1200x630px)</li>
            <li>✅ Mark important announcements as "Premium Sponsor"</li>
            <li>✅ Keep summaries under 150 characters</li>
            <li>✅ All posts appear immediately on the homepage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
