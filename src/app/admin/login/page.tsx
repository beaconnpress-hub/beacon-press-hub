"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Replace with Supabase Auth integration
      // For MVP: Use hardcoded credentials (CHANGE IN PRODUCTION)
      const ADMIN_EMAIL = "admin@beaconpress.com";
      const ADMIN_PASSWORD = "Beacon123!@#";

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Set secure cookie for session
        document.cookie = "admin_session=authenticated; path=/; max-age=86400"; // 24 hours
        
        // Redirect to publisher
        router.push("/admin/publisher");
      } else {
        setError("❌ Invalid email or password");
      }
    } catch (err) {
      setError("❌ Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6 font-sans">
      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* LOGIN CARD */}
      <div className="relative max-w-md w-full">
        <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
          {/* HEADER */}
          <div className="text-center mb-10">
            <div className="text-4xl font-black italic tracking-tighter mb-2">
              BEACON<span className="text-blue-500">PRESS</span>
            </div>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">🔐 Admin Portal Access</p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-bold text-center">
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL INPUT */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@beaconpress.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition disabled:opacity-50 placeholder:text-slate-600"
              />
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition disabled:opacity-50 placeholder:text-slate-600"
              />
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4" />
              <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer">
                Keep me signed in
              </label>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30"
            >
              {loading ? "🔓 UNLOCKING..." : "🔐 SECURE LOGIN"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-slate-500 font-bold">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* TEST CREDENTIALS (FOR MVP ONLY) */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">📝 Test Credentials (MVP)</p>
            <p className="text-[10px] text-slate-400 font-mono">Email: admin@beaconpress.com</p>
            <p className="text-[10px] text-slate-400 font-mono">Password: Beacon123!@#</p>
          </div>

          {/* FOOTER */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-500 italic">
              🚀 Emergency Admin Panel v1.0 | Contact support for access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
