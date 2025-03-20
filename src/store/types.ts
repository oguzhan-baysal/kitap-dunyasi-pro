export interface RootState {
  version: string
  books: BooksState
  currency: CurrencyState
  favorites: FavoritesState
  auth: AuthState
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  tokenExpiresAt: number
  loading: boolean
  error: string | null
}

export interface User {
  id: number
  name: string
  email: string
}

export interface CurrencyState {
  rates: Record<string, number>
  baseCurrency: string
  selectedCurrency: string
  loading: boolean
  error: string | null
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
  category: string
  imageUrl: string
  rating: number
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
  selectedBook: Book | null
  loading: boolean
  error: string | null
  filters: BookFilters
  sort: BookSort
} 