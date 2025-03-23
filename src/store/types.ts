export interface Book {
  id: number
  title: string
  author: string
  description: string
  price: number
  coverImage: string
  category: string
  language: string
  pageCount: number
  publishYear: number
  publishDate: string
  publisher?: string
  isbn?: string
  isFree: boolean
  rating?: number
  isFavorite?: boolean
  userId: number
}

export interface User {
  id: number
  name: string
  email: string
  token?: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  token: string | null
  refreshToken: string | null
  tokenExpiresAt: number | null
  csrfToken: string | null
}

export interface BooksState {
  items: Book[]
  loading: boolean
  error: string | null
  hasMore: boolean
  currentPage: number
  itemsPerPage: number
  sort: {
    field: string
    order: 'asc' | 'desc'
  }
  filters: {
    search: string | null
    category: string | null
    language: string | null
    minPrice: number | null
    maxPrice: number | null
    minYear: number | null
    maxYear: number | null
    minPages: number | null
    maxPages: number | null
    isFree: boolean | null
    rating: number | null
  }
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
  items: Book[]
  loading: boolean
  error: string | null
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
  items: Comment[]
  loading: boolean
  error: string | null
}

export interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  notifications: Array<{
    id: number
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
  }>
}

export interface RootState {
  auth: AuthState
  books: BooksState
  currency: CurrencyState
  favorites: FavoritesState
  comments: CommentsState
  ui: UIState
  version?: string
} 