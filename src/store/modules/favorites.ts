// @ts-ignore
import type { Module } from 'vuex'
import type { RootState, FavoritesState, Book } from '@/types'

const STORAGE_KEY = 'kitap-dunyasi-favorites'

const state: FavoritesState = {
  favorites: [],
  loading: false,
  error: null
}

const getters = {
  getFavorites: (state: FavoritesState) => state.favorites,
  isLoading: (state: FavoritesState) => state.loading,
  getError: (state: FavoritesState) => state.error,
  isFavorite: (state: FavoritesState) => (bookId: number) => {
    return state.favorites.some(book => book.id === bookId)
  }
}

const mutations = {
  SET_FAVORITES(state: FavoritesState, favorites: Book[]) {
    state.favorites = favorites
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  },
  ADD_FAVORITE(state: FavoritesState, book: Book) {
    state.favorites.push(book)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites))
  },
  REMOVE_FAVORITE(state: FavoritesState, bookId: number) {
    state.favorites = state.favorites.filter(book => book.id !== bookId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites))
  },
  SET_LOADING(state: FavoritesState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: FavoritesState, error: string | null) {
    state.error = error
  }
}

const actions = {
  async loadFavorites({ commit }: { commit: any }) {
    commit('SET_LOADING', true)
    try {
      const storedFavorites = localStorage.getItem(STORAGE_KEY)
      if (storedFavorites) {
        commit('SET_FAVORITES', JSON.parse(storedFavorites))
      }
    } catch (error) {
      commit('SET_ERROR', 'Favoriler yüklenirken bir hata oluştu')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async addToFavorites({ commit, state }: { commit: any, state: FavoritesState }, book: Book) {
    try {
      const favorites = [...state.favorites, { ...book, isFavorite: true }]
      commit('SET_FAVORITES', favorites)
    } catch (error) {
      commit('SET_ERROR', 'Kitap favorilere eklenirken bir hata oluştu')
    }
  },

  async removeFromFavorites({ commit, state }: { commit: any, state: FavoritesState }, bookId: number) {
    try {
      const favorites = state.favorites.filter((book: Book) => book.id !== bookId)
      commit('SET_FAVORITES', favorites)
    } catch (error) {
      commit('SET_ERROR', 'Kitap favorilerden çıkarılırken bir hata oluştu')
    }
  },

  async toggleFavorite({ dispatch, getters, rootState }: { dispatch: any, getters: any, rootState: RootState }, bookId: number) {
    if (getters.isFavorite(bookId)) {
      await dispatch('removeFromFavorites', bookId)
    } else {
      const book = rootState.books.books.find((b: Book) => b.id === bookId)
      if (book) {
        await dispatch('addToFavorites', book)
      }
    }
  }
}

const favorites: Module<FavoritesState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default favorites 