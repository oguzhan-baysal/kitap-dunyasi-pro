export interface RootState {
  version: string
  auth: AuthState
  books: BooksState
  currency: CurrencyState
  favorites: FavoritesState
  comments: CommentsState
  ui: UIState
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  tokenExpiresAt: number
  loading: boolean
  error: string | null
  csrfToken: string | null
}

export interface User {
  id: number
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface CurrencyState {
  rates: Record<string, number>
  baseCurrency: string
  selectedCurrency: string
  loading: boolean
  error: string | null
  lastUpdate: string | null
}

export interface FavoritesState {
  favorites: Book[]
  loading: boolean
  error: string | null
}

export interface UIState {
  theme: 'light' | 'dark'
}

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
  isFree: boolean
}

export interface Comment {
  id: number
  bookId: number
  userId: number
  text: string
  rating: number
  createdAt: string
  updatedAt: string
}

export interface CommentsState {
  comments: Comment[]
  loading: boolean
  error: string | null
}

export interface BookFilters {
  category: string
  minPrice: number
  maxPrice: number
  searchQuery: string
}

export interface BookSort {
  field: string
  order: 'asc' | 'desc'
}

export interface BooksState {
  books: Book[]
  userBooks: Book[]
  userFavorites: Book[]
  currentBook: Book | null
  currentPage: number
  itemsPerPage: number
  hasMore: boolean
  loading: boolean
  error: string | null
  filters: {
    category: string | null
    minPrice: number | null
    maxPrice: number | null
    rating: number | null
  }
  sort: {
    field: string
    order: 'asc' | 'desc'
  }
} 