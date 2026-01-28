'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { PostSchema, type PostFormValues } from '@/lib/validation'
import { logAdminAction } from '@/lib/audit'
import ImageUpload from '@/components/admin/ImageUpload'

interface PostFormProps {
    initialData?: Partial<PostFormValues> | null
    postId?: string
}

export default function PostForm({ initialData, postId }: PostFormProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const isEditMode = !!initialData

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<PostFormValues>({
        resolver: zodResolver(PostSchema),
        defaultValues: initialData || {
            title: '',
            category: 'Tech',
            summary: '',
            content: '',
            image_url: '',
            author: 'Beacon Admin',
            is_sponsored: false,
            link: '',
        },
    })

    const onSubmit = async (data: PostFormValues) => {
        setLoading(true)
        const promise = new Promise<void>(async (resolve, reject) => {
            try {
                if (isEditMode && postId) {
                    const { error } = await supabase
                        .from('posts')
                        .update(data)
                        .eq('id', postId)

                    if (error) throw error
                    await logAdminAction(supabase, 'UPDATE', 'posts', postId, `Updated: ${data.title}`)
                    router.push('/admin/dashboard')
                    resolve()
                } else {
                    const { data: newPost, error } = await supabase
                        .from('posts')
                        .insert(data)
                        .select()
                        .single()

                    if (error) throw error
                    if (newPost) {
                        await logAdminAction(supabase, 'CREATE', 'posts', newPost.id, `Created: ${data.title}`)
                    }
                    reset()
                    resolve()
                }
                router.refresh()
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Operation failed'
                reject(errorMessage)
            } finally {
                setLoading(false)
            }
        })

        await toast.promise(promise, {
            loading: isEditMode ? 'Updating article...' : 'Publishing article...',
            success: isEditMode ? 'Article updated successfully!' : 'Article published successfully!',
            error: (err: unknown) => `Error: ${err}`,
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                    {isEditMode ? 'Edit Article' : 'Create New Article'}
                </h2>
            </div>

            {/* Grid for top inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                    <label className="block text-gray-400 text-sm mb-2">Title *</label>
                    <input
                        {...register('title')}
                        className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                        placeholder="Enter article title"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Category */}
                <div>
                    <label className="block text-gray-400 text-sm mb-2">Category *</label>
                    <select
                        {...register('category')}
                        className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                    >
                        <option value="Politics">Politics</option>
                        <option value="Tech">Tech</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Business">Business</option>
                        <option value="Sports">Sports</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Crypto">Crypto</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>
            </div>

            {/* Summary */}
            <div>
                <label className="block text-gray-400 text-sm mb-2">Summary (SEO) *</label>
                <textarea
                    {...register('summary')}
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                    placeholder="Brief overview for preview cards..."
                />
                {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary.message}</p>}
            </div>

            {/* Image URL */}
            <div>
                <label className="block text-gray-400 text-sm mb-2">Featured Image</label>
                <ImageUpload
                    value={watch('image_url')}
                    onChange={(url) => setValue('image_url', url, { shouldValidate: true })}
                    disabled={loading}
                />
                {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url.message}</p>}
            </div>

            {/* Author */}
            <div>
                <label className="block text-gray-400 text-sm mb-2">Author</label>
                <input
                    {...register('author')}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                    placeholder="Author name"
                />
                {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
            </div>

            {/* Read More Link */}
            <div>
                <label className="block text-gray-400 text-sm mb-2">Read More Link</label>
                <input
                    {...register('link')}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                    placeholder="https://external-link.com"
                />
                {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link.message}</p>}
            </div>

            {/* Main Content */}
            <div>
                <label className="block text-gray-400 text-sm mb-2">Content *</label>
                <textarea
                    {...register('content')}
                    rows={12}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none font-mono text-sm"
                    placeholder="Write your article content here (Markdown supported)..."
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
            </div>

            {/* Sponsored Checkbox */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    {...register('is_sponsored')}
                    id="sponsored"
                    className="w-4 h-4 rounded"
                />
                <label htmlFor="sponsored" className="text-gray-400 text-sm">
                    Mark as Sponsored Content
                </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-700">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-transparent hover:bg-gray-700 text-gray-300 rounded border border-gray-600 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : (isEditMode ? 'Update Article' : 'Publish Article')}
                </button>
            </div>
        </form>
    )
}
