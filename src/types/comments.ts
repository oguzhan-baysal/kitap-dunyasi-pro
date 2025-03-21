import type { Book } from './books'
import type { User } from './user'

export interface Comment {
  id: number
  text: string
  rating: number
  user: User
  book: Book
  createdAt: string
  updatedAt: string
}

export interface CommentFilters {
  bookId?: number
  userId?: number
  rating?: number
  sortBy?: 'createdAt' | 'rating'
  order?: 'asc' | 'desc'
}

export interface CommentState {
  comments: Comment[]
  loading: boolean
  error: string | null
  filters: CommentFilters
} 