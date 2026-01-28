'use client'
import { useState, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import toast from 'react-hot-toast'

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    disabled?: boolean
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // 1. Basic Validation
        if (!file.type.startsWith('image/')) {
            toast.error('File must be an image')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB')
            return
        }

        setIsUploading(true)

        try {
            // 2. Generate unique file path
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `uploads/${fileName}`

            // 3. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('beacon-assets')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 4. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('beacon-assets')
                .getPublicUrl(filePath)

            // 5. Update Parent Form
            onChange(publicUrl)
            toast.success('Image uploaded!')
        } catch (error: unknown) {
            console.error(error)
            const errorMsg = error instanceof Error ? error.message : 'Upload failed'
            toast.error(errorMsg)
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemove = () => {
        onChange('')
    }

    return (
        <div className="w-full">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                accept="image/*"
                disabled={disabled || isUploading}
                title="Upload image file"
                aria-label="Upload image file"
            />

            {value ? (
                // STATE: Image Present
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-700 group">
                    <img
                        src={value}
                        alt="Upload preview"
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={handleRemove}
                        type="button"
                        className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                // STATE: Empty / Upload Prompt
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`
            border-2 border-dashed border-gray-700 rounded-lg p-8
            flex flex-col items-center justify-center cursor-pointer
            hover:border-blue-500 hover:bg-gray-800/50 transition
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
                >
                    {isUploading ? (
                        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-2" />
                    ) : (
                        <div className="bg-gray-800 p-3 rounded-full mb-3">
                            <span className="block text-2xl">📤</span>
                        </div>
                    )}

                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-300">
                            {isUploading ? 'Uploading...' : 'Click to upload image'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG or GIF (max 5MB)
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
