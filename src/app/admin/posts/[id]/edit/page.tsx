'use client'
import { useEffect, useState, use } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import PostForm from '@/components/admin/PostForm'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Skeleton from '@/components/ui/Skeleton'

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [post, setPost] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          toast.error('Could not find post')
          router.push('/admin/dashboard')
          return
        }

        setPost(data)
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading post'
        toast.error(errorMessage)
        router.push('/admin/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Skeleton className="w-24 h-6 mb-4" />
            <Skeleton className="w-48 h-10" />
          </div>
          <div className="space-y-4">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-64" />
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">Post not found</p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-gray-400 hover:text-white text-sm mb-2 block"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">Editor Studio</h1>
        </div>

        <PostForm initialData={post} postId={post.id} />
      </div>
    </div>
  )
}
