import { createStore } from 'vuex'
import type { RootState } from '@/types'

// Modülleri import et
import { auth } from './modules/auth'
import { books } from './modules/books'
import { currency } from './modules/currency'
import favorites from './modules/favorites'
import comments from './modules/comments'
import ui from './modules/ui'

const store = createStore<RootState>({
  state: {
    version: '1.0.0',
    auth: {
      user: null,
      token: null,
      refreshToken: null,
      tokenExpiresAt: 0,
      loading: false,
      error: null,
      csrfToken: null
    },
    books: {
      books: [],
      userBooks: [],
      userFavorites: [],
      currentBook: null,
      currentPage: 1,
      itemsPerPage: 10,
      hasMore: false,
      loading: false,
      error: null,
      filters: {
        category: null,
        minPrice: null,
        maxPrice: null,
        rating: null
      },
      sort: {
        field: 'title',
        order: 'asc'
      }
    },
    currency: {
      rates: {},
      baseCurrency: 'TRY',
      selectedCurrency: 'TRY',
      loading: false,
      error: null,
      lastUpdate: null
    },
    favorites: {
      favorites: [],
      loading: false,
      error: null
    },
    comments: {
      comments: [],
      loading: false,
      error: null
    },
    ui: {
      theme: 'light'
    }
  },
  modules: {
    auth,
    books,
    currency,
    favorites,
    comments,
    ui
  }
})

export function useStore() {
  return store
}

export type Store = typeof store

export default store 