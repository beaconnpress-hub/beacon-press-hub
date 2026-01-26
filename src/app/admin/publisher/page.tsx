"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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
        setMessage("✅ Post published successfully!");
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
      setMessage("❌ Publishing failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter">
              BEACON<span className="text-blue-500">PRESS</span>
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Admin Dashboard</p>
            <div className="flex gap-4 mt-3">
              <a 
                href="/admin/publisher" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-sm uppercase transition"
              >
                📝 Publisher
              </a>
              <a 
                href="/admin/flier-generator" 
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-sm uppercase transition"
              >
                🎨 Flier Generator
              </a>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-sm uppercase transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-slate-900 p-10 rounded-2xl border border-white/5 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Headline (Required)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Breaking news..." 
                    value={post.title}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                    className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white placeholder:text-slate-600 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Category
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
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Summary (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Brief preview..." 
                    value={post.summary}
                    maxLength={150}
                    onChange={(e) => setPost({ ...post, summary: e.target.value })}
                    className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white placeholder:text-slate-600 transition"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">{post.summary.length}/150 chars</p>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Featured Image (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="https://unsplash.com/..." 
                    value={post.image_url}
                    onChange={(e) => setPost({ ...post, image_url: e.target.value })}
                    className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white placeholder:text-slate-600 transition"
                  />
                  {post.image_url && (
                    <img 
                      src={post.image_url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border border-white/10 mt-3"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Content (Required)
                  </label>
                  <textarea 
                    placeholder="Write your story..." 
                    value={post.content}
                    onChange={(e) => setPost({ ...post, content: e.target.value })}
                    className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white placeholder:text-slate-600 h-48 resize-none transition"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">{post.content.length} characters</p>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Read More Link (Optional)
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://example.com/..." 
                    value={post.link}
                    onChange={(e) => setPost({ ...post, link: e.target.value })}
                    className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-white placeholder:text-slate-600 transition"
                  />
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-white/5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={post.is_sponsored}
                      onChange={(e) => setPost({ ...post, is_sponsored: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-xs font-black text-slate-300 uppercase">
                      Premium Sponsor
                    </span>
                  </label>
                </div>

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

                <button 
                  onClick={handlePublish}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 py-6 rounded-xl font-black text-sm uppercase tracking-widest transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Publishing..." : "Publish to Hub"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4">Tips</h3>
              <ul className="text-xs text-slate-400 space-y-3">
                <li>Use clear headlines</li>
                <li>1200x630px images</li>
                <li>Keep summary under 150 chars</li>
                <li>Mark sponsor posts</li>
                <li>Posts appear instantly</li>
              </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4">Status</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Published</span>
                  <span className="font-black">--</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sponsored</span>
                  <span className="font-black">--</span>
                </div>
              </div>
            </div>

            <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
              <p className="text-[10px] font-black text-red-400 uppercase mb-2">Security</p>
              <p className="text-[10px] text-red-300/70">Session expires in 24h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
