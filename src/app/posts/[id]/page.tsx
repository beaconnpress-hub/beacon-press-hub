"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

type Post = {
    id: string;
    title: string;
    category: string;
    summary: string;
    content?: string;
    image_url: string;
    author: string;
    link?: string;
    is_sponsored: boolean;
    created_at: string;
};

export default function PostDetail() {
    const params = useParams();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const postId = params.id as string;

    useEffect(() => {
        async function fetchPost() {
            if (!postId) return;

            const { data, error: fetchError } = await supabase
                .from("posts")
                .select("*")
                .eq("id", postId)
                .single();

            if (fetchError || !data) {
                setError("Post not found");
                setLoading(false);
                return;
            }

            setPost(data as Post);
            setLoading(false);
        }

        fetchPost();
    }, [postId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center gap-6">
                <h1 className="text-3xl font-bold">404 - Post Not Found</h1>
                <p className="text-slate-400">{error || "The article you're looking for doesn't exist."}</p>
                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition"
                >
                    ← Back to Home
                </button>
            </div>
        );
    }

    const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <main className="min-h-screen bg-[#020617] text-white">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
                <div className="text-2xl font-black italic tracking-tighter cursor-pointer">
                    BEACON<span className="text-[#00B2FF]">PRESS</span>
                </div>
                <button
                    onClick={() => router.push("/")}
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition text-sm font-bold"
                >
                    ← Back
                </button>
            </nav>

            {/* Hero Image */}
            <div className="relative w-full h-96 overflow-hidden">
                {post.image_url ? (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl font-black text-white/80">{post.category[0]}</div>
                        </div>
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-600/30 border border-blue-500 rounded-full text-xs font-bold text-blue-400 uppercase">
                                {post.category}
                            </span>
                            {post.is_sponsored && (
                                <span className="px-3 py-1 bg-yellow-600/30 border border-yellow-500 rounded-full text-xs font-bold text-yellow-400 uppercase">
                                    Sponsored
                                </span>
                            )}
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-6 text-slate-400 pt-4 border-t border-white/5">
                            <span className="font-bold">{post.author}</span>
                            <span>•</span>
                            <span>{formattedDate}</span>
                        </div>
                    </div>

                    {/* Summary/Lead Paragraph */}
                    <div className="text-xl text-slate-300 leading-relaxed italic">
                        {post.summary}
                    </div>

                    {/* Main Content */}
                    <div className="prose prose-invert max-w-none space-y-6">
                        <div className="text-lg text-slate-200 leading-relaxed whitespace-pre-wrap">
                            {post.content || (
                                <div className="p-8 bg-slate-900/50 rounded-xl border border-white/5">
                                    <p className="text-slate-400">
                                        This article was published through the admin panel. Full content can be added through the publisher interface.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* External Link */}
                    {post.link && (
                        <div className="mt-12 pt-8 border-t border-white/5">
                            <a
                                href={post.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition"
                            >
                                Read Full Story →
                            </a>
                        </div>
                    )}

                    {/* Related Articles */}
                    <div className="mt-20 pt-12 border-t border-white/5">
                        <h2 className="text-2xl font-black mb-8">More from {post.category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-slate-900/50 border border-white/5 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition"
                            >
                                <p className="text-xs font-bold text-blue-400 uppercase mb-2">{post.category}</p>
                                <h3 className="text-lg font-black mb-2">More stories coming soon</h3>
                                <p className="text-sm text-slate-400">Check back for related articles in this category.</p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
