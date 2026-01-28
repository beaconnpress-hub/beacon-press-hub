'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import Skeleton from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'
import { useAdminAuth, AdminLoadingSpinner } from '@/lib/useAdminAuth'
import type { FlierData } from '@/lib/types'

export default function SavedFliersPage() {
    const router = useRouter()
    const { isAuthorized, loading: authLoading } = useAdminAuth()
    const [fliers, setFliers] = useState<FlierData[]>([])
    const [loading, setLoading] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchFliers = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('fliers')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) setFliers(data)
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to load fliers'
            toast.error(errorMsg)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchFliers()
    }, [fetchFliers])

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this design?')) return

        try {
            const { error } = await supabase.from('fliers').delete().eq('id', id)
            if (error) throw error

            setFliers(prev => prev.filter(f => f.id !== id))
            toast.success('Flier deleted')
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to delete'
            toast.error(errorMsg)
        }
    }

    // Show loading state while checking authentication
    if (authLoading) {
        return <AdminLoadingSpinner />
    }

    // Redirect if not authorized
    if (!isAuthorized) {
        return null
    }

    return (
        <div className="p-8 min-h-screen bg-gray-900 text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">📚 Marketing Library</h1>
                <Link
                    href="/admin/flier-generator"
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition"
                >
                    + Create New Flier
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="h-64 w-full rounded-lg" />
                    ))}
                </div>
            ) : fliers.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg mb-4">No saved fliers yet.</p>
                    <Link
                        href="/admin/flier-generator"
                        className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition"
                    >
                        Create Your First Flier
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fliers.map((flier) => (
                        <div
                            key={flier.id}
                            className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden flex flex-col hover:border-blue-500 transition"
                        >
                            {/* Preview Area */}
                            <div className="h-40 bg-gray-700 relative overflow-hidden group">
                                {flier.image_url ? (
                                    <img
                                        src={flier.image_url}
                                        alt={flier.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500 text-3xl">
                                        🏠
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <span className="text-white font-bold">View Details</span>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-4 flex-1">
                                <h3 className="font-bold text-lg truncate text-white">{flier.title}</h3>
                                <p className="text-blue-400 text-sm font-bold mb-2">{flier.price}</p>
                                <p className="text-gray-400 text-xs flex items-center gap-1">
                                    📍 {flier.location}
                                </p>

                                {/* Features Preview */}
                                {flier.features && flier.features.length > 0 && (
                                    <div className="mt-3 text-xs text-gray-500">
                                        <p className="font-semibold text-gray-400 mb-1">Features:</p>
                                        <ul className="list-disc list-inside">
                                            {flier.features.slice(0, 2).map((feature, idx) => (
                                                <li key={idx} className="truncate">
                                                    {feature}
                                                </li>
                                            ))}
                                            {flier.features.length > 2 && (
                                                <li className="text-gray-500">+{flier.features.length - 2} more</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Actions Footer */}
                            <div className="bg-gray-900/50 p-3 flex justify-between items-center border-t border-gray-700">
                                <span className="text-xs text-gray-500">
                                    {flier.created_at
                                        ? new Date(flier.created_at).toLocaleDateString()
                                        : 'Just now'}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDelete(flier.id || '')}
                                        className="p-2 hover:bg-red-500/20 text-red-400 rounded transition hover:text-red-300 font-bold"
                                    >
                                        🗑️
                                    </button>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(flier.id || '')}
                                        className="p-2 hover:bg-blue-500/20 text-blue-400 rounded transition hover:text-blue-300 font-bold"
                                        title="Copy ID"
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats Section */}
            {!loading && fliers.length > 0 && (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <p className="text-gray-400 text-sm mb-2">Total Fliers</p>
                        <p className="text-3xl font-bold text-blue-400">{fliers.length}</p>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <p className="text-gray-400 text-sm mb-2">Last Created</p>
                        <p className="text-sm text-gray-300">
                            {fliers[0]?.created_at
                                ? new Date(fliers[0].created_at).toLocaleDateString()
                                : 'N/A'}
                        </p>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <p className="text-gray-400 text-sm mb-2">Storage Used</p>
                        <p className="text-sm text-gray-300">
                            {Math.round((fliers.reduce((sum, f) => sum + (f.image_url?.length || 0), 0) / 1024 / 1024) * 100) / 100} MB
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
