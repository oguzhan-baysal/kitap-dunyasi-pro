export interface Book {
  id: string
  title: string
  author: string
  price: number
  coverImage: string
  description: string
  category: string
  language: string
  pageCount: number
  publishYear: number
  publisher: string
  isbn: string
}

export interface RootState {
  auth: AuthState
  currency: CurrencyState
  favorites: FavoritesState
}

export interface AuthState {
  user: User | null
  token: string | null
}

export interface User {
  id: string
  name: string
  email: string
}

export interface CurrencyState {
  rates: Record<string, number>
  selectedCurrency: string
  lastUpdate: number | null
}

export interface FavoritesState {
  favorites: string[]
} 