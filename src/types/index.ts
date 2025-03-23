export interface Book {
  id: number
  title: string
  author: string
  description: string
  price: number
  rating: number
  publishDate: string
  coverImage: string
  category: string
  language: string
  pageCount: number
  publishYear: number
  publisher?: string
  isbn?: string
  isFavorite: boolean
  isFree: boolean
  userId: number
}

export interface User {
  id: number
  name: string
  email: string
  createdAt: string
  updatedAt: string
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

export interface RootState {
  version: string
  auth?: AuthState
  books?: BooksState
  currency?: CurrencyState
  favorites?: FavoritesState
  comments?: CommentsState
  ui?: UIState
}

// Modül state tipleri
export interface AuthModuleState {
  auth: AuthState
}

export interface BooksModuleState {
  books: BooksState
}

export interface CurrencyModuleState {
  currency: CurrencyState
}

export interface FavoritesModuleState {
  favorites: FavoritesState
}

export interface CommentsModuleState {
  comments: CommentsState
}

export interface UIModuleState {
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
  newBook: {
    title: string
    author: string
    description: string
    price: number
    coverImage: string
    category: string
    language: string
    pageCount: number
    publishYear: number
    isFree: boolean
  } | null
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
  sort: {
    field: string
    order: 'asc' | 'desc'
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
  favorites: Book[]
  loading: boolean
  error: string | null
}

export interface CommentsState {
  comments: Comment[]
  loading: boolean
  error: string | null
}

export interface UIState {
  theme: 'light' | 'dark'
} 