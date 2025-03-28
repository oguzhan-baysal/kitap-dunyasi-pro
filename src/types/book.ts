export interface Book {
  id: number
  title: string
  author: string
  description: string
  price: number
  rating: number
  publishDate?: string
  coverImage: string
  category?: string
  language?: string
  pageCount?: number
  publishYear?: number
  publisher?: string
  isbn?: string
  isFavorite?: boolean
} 