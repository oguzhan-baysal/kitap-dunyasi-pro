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
  publisher?: string
  isbn?: string
  rating: number
  publishDate?: string
  isFree: boolean
  isFavorite: boolean
  userId: number
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