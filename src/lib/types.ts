// Flier Data Structure
export interface FlierData {
    id?: string // Optional - new fliers don't have ID yet
    title: string
    location: string
    price: string
    image_url: string
    features: string[]
    contact_info: {
        name: string
        phone: string
        email?: string
    }
    status?: 'draft' | 'archived'
    created_at?: string
}

// Post Data Structure (for reference)
export interface PostData {
    id?: string
    title: string
    category: string
    summary: string
    content: string
    image_url: string
    author: string
    is_sponsored: boolean
    link?: string
    created_at?: string
}
