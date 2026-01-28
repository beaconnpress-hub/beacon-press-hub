import { z } from 'zod'

export const PostSchema = z.object({
    title: z.string()
        .min(5, "Title must be at least 5 characters")
        .max(100, "Title must not exceed 100 characters"),
    summary: z.string()
        .min(10, "Summary must be at least 10 characters")
        .max(250, "Summary must not exceed 250 characters"),
    category: z.enum(['Politics', 'Tech', 'Real Estate', 'Business', 'Sports', 'Entertainment', 'Crypto']),
    content: z.string()
        .min(50, "Content must be at least 50 characters")
        .max(5000, "Content must not exceed 5000 characters"),
    image_url: z.string().url().optional().or(z.literal('')),
    author: z.string()
        .min(2, "Author name must be at least 2 characters")
        .max(100, "Author name must not exceed 100 characters")
        .optional(),
    is_sponsored: z.boolean().optional(),
    link: z.string().url().optional().or(z.literal('')),
})

// Explicitly type form values with required fields and optional fields
export type PostFormValues = {
    title: string
    summary: string
    category: 'Politics' | 'Tech' | 'Real Estate' | 'Business' | 'Sports' | 'Entertainment' | 'Crypto'
    content: string
    image_url?: string
    author?: string
    is_sponsored?: boolean
    link?: string
}


