'use client'
import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import toast from 'react-hot-toast'
import { logAdminAction } from '@/lib/audit'

interface Post {
    id: string
    title: string
    category: string
    created_at: string
}

export default function PostManager() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchPosts = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('id, title, category, created_at')
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) setPosts(data)
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load posts'
            toast.error(`Error loading posts: ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return

        const promise = new Promise<void>(async (resolve, reject) => {
            try {
                const { error } = await supabase.from('posts').delete().match({ id })

                if (error) throw error

                await logAdminAction(supabase, 'DELETE', 'posts', id, `Deleted: ${title}`)
                setPosts(posts.filter(p => p.id !== id))
                resolve()
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to delete post'
                reject(errorMessage)
            }
        })

        await toast.promise(promise, {
            loading: 'Deleting post...',
            success: 'Post deleted successfully',
            error: (err: unknown) => `Error: ${err}`,
        })
    }

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="text-gray-300 mt-4">Loading posts...</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Manage Content</h3>
                <span className="text-gray-400 text-sm">{posts.length} Posts</span>
            </div>

            {posts.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                    <p>No posts yet. Start by publishing your first article!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-gray-900 text-gray-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-700/50 transition">
                                    <td className="px-6 py-4 font-medium text-white truncate max-w-xs">
                                        {post.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(post.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button
                                            onClick={() => window.location.href = `/admin/posts/${post.id}/edit`}
                                            className="text-blue-400 hover:text-blue-300 transition font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id, post.title)}
                                            className="text-red-400 hover:text-red-300 transition font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
