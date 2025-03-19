export interface RootState {
  auth: AuthState
  books: BooksState
  currency: CurrencyState
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

export interface User {
  id: number
  name: string
  email: string
}

export interface CurrencyState {
  rates: { [key: string]: number }
  baseCurrency: string
  selectedCurrency: string
  loading: boolean
  error: string | null
}

export interface FavoritesState {
  favorites: number[]
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
  category: string
  coverImage?: string
}

export interface BooksState {
  books: Book[]
  loading: boolean
  error: string | null
  selectedBook: Book | null
  filters: {
    category: string | null
    priceRange: { min: number; max: number }
    rating: number | null
    searchQuery: string
  }
  sort: {
    field: string
    order: 'asc' | 'desc'
  }
} 