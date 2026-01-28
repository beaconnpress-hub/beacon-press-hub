'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useAdminAuth, AdminLoadingSpinner } from '@/lib/useAdminAuth'
import PostManager from '@/components/admin/PostManager'

export default function AdminDashboard() {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [loading, setLoading] = useState(true)
    
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/admin/login')
                    return
                }
                setIsAuthorized(true)
            } catch (error) {
                console.error('Auth check error:', error)
                router.push('/admin/login')
            } finally {
                setLoading(false)
            }
        }
        checkAuth()
    }, [router, supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Verifying authentication...</p>
                </div>
            </div>
        )
    }

    // Redirect if not authorized
    if (!isAuthorized) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Beacon Press Admin</h1>
                        <p className="text-gray-400">Content Management & Publishing Control</p>
                    </div>
                    <div className="space-x-4">
                        <a
                            href="/admin/publisher"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition"
                        >
                            Create Post
                        </a>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">System Status</p>
                        <p className="text-3xl font-bold mt-2">Active</p>
                        <p className="text-green-400 text-sm mt-2">✓ Supabase Connected</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">Auth Method</p>
                        <p className="text-3xl font-bold mt-2">Supabase</p>
                        <p className="text-green-400 text-sm mt-2">✓ Secure SSR</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">Data Validation</p>
                        <p className="text-3xl font-bold mt-2">Enabled</p>
                        <p className="text-green-400 text-sm mt-2">✓ Zod Schemas</p>
                    </div>
                </div>

                {/* Post Manager */}
                <PostManager />

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-bold mb-4">Quick Start</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-center gap-3">
                                <span className="text-blue-400">✓</span>
                                <span>Supabase Auth integrated</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-blue-400">✓</span>
                                <span>Input validation with Zod</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-blue-400">✓</span>
                                <span>Post creation & deletion</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-blue-400">✓</span>
                                <span>Real-time database sync</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-bold mb-4">Security Updates</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-center gap-3">
                                <span className="text-green-400">🔒</span>
                                <span>Removed hardcoded credentials</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-green-400">🔒</span>
                                <span>Server-side session validation</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-green-400">🔒</span>
                                <span>XSS protection via Zod</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-green-400">🔒</span>
                                <span>CSRF tokens in middleware</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
