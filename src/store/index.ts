import { createStore } from 'vuex'
import { auth } from './modules/auth'
import { books } from './modules/books'
import { currency } from './modules/currency'
import { comments } from './modules/comments'
import favorites from './modules/favorites'
import ui from './modules/ui'
import type { RootState } from './types'

const store = createStore<RootState>({
  state: () => ({
    version: '1.0.0',
    auth: {
      user: null,
      token: null,
      refreshToken: null,
      tokenExpiresAt: 0,
      loading: false,
      error: null
    },
    books: {
      books: [],
      userBooks: [],
      userFavorites: [],
      currentBook: null,
      currentPage: 1,
      itemsPerPage: 12,
      hasMore: true,
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
    comments: {},
    ui: {
      theme: 'light'
    }
  }),
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

export default store 