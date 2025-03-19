export interface RootState {
  version: string
  auth: AuthState
  currency: CurrencyState
  favorites: FavoritesState
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface CurrencyState {
  rates: Record<string, number>
  selectedCurrency: string
  lastUpdate: number | null
  isLoading: boolean
  error: string | null
}

export interface FavoritesState {
  favorites: string[]
} 