import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

/**
 * useAdminAuth - Protects admin routes from unauthorized access
 * Returns: { isAuthorized: boolean, loading: boolean, user: any }
 */
export function useAdminAuth() {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

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
                setUser(user)
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

    return { isAuthorized, loading, user }
}

/**
 * AdminLoadingSpinner - Shows while checking authentication
 */
export function AdminLoadingSpinner() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Verifying authentication...</p>
            </div>
        </div>
    )
}

/**
 * AdminAuthGuard - Wraps component to protect with auth
 */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthorized, loading } = useAdminAuth()

    if (loading) {
        return <AdminLoadingSpinner />
    }

    if (!isAuthorized) {
        return null
    }

    return <>{children}</>
}
