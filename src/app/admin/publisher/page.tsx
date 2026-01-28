"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import PostForm from "@/components/admin/PostForm"
import { useAdminAuth, AdminLoadingSpinner } from "@/lib/useAdminAuth"

export const dynamic = "force-dynamic"

export default function AdminPublisher() {
  const router = useRouter()
  const { isAuthorized, loading } = useAdminAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  // Show loading state while checking authentication
  if (loading) {
    return <AdminLoadingSpinner />
  }

  // Redirect if not authorized
  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Beacon Press Admin</h1>
            <p className="text-gray-400">Create and publish news articles</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition"
          >
            Logout
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          <a
            href="/admin/dashboard"
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition"
          >
            ← Back to Dashboard
          </a>
        </div>

        {/* Form */}
        <PostForm />
      </div>
    </div>
  )
}
