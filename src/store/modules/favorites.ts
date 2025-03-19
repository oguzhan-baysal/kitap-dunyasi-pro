// @ts-ignore
import { Module, Commit } from 'vuex'
import { RootState } from '../types'
import type { Book } from '../types'

interface FavoritesState {
  favorites: Book[]
  loading: boolean
  error: string | null
}

const state = (): FavoritesState => ({
  favorites: [],
  loading: false,
  error: null
})

const getters = {
  getFavorites: (state: FavoritesState): Book[] => state.favorites,
  isFavorite: (state: FavoritesState) => (bookId: number): boolean => {
    return state.favorites.some(book => book.id === bookId)
  }
}

const mutations = {
  SET_FAVORITES(state: FavoritesState, favorites: Book[]) {
    state.favorites = favorites
  },
  ADD_TO_FAVORITES(state: FavoritesState, book: Book) {
    if (!state.favorites.some(f => f.id === book.id)) {
      state.favorites.push(book)
    }
  },
  REMOVE_FROM_FAVORITES(state: FavoritesState, bookId: number) {
    state.favorites = state.favorites.filter(book => book.id !== bookId)
  },
  SET_LOADING(state: FavoritesState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: FavoritesState, error: string | null) {
    state.error = error
  }
}

const actions = {
  async initialize({ commit }: { commit: Commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      // TODO: localStorage'dan favorileri yükle
      const favorites: Book[] = []
      commit('SET_FAVORITES', favorites)
    } catch (error) {
      console.error('Favorites initialization error:', error)
      commit('SET_ERROR', 'Favoriler yüklenirken bir hata oluştu')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  addToFavorites({ commit }: { commit: Commit }, book: Book) {
    try {
      commit('ADD_TO_FAVORITES', book)
      // TODO: localStorage'a kaydet
    } catch (error) {
      console.error('Add to favorites error:', error)
      commit('SET_ERROR', 'Favorilere eklenirken bir hata oluştu')
    }
  },

  removeFromFavorites({ commit }: { commit: Commit }, bookId: number) {
    try {
      commit('REMOVE_FROM_FAVORITES', bookId)
      // TODO: localStorage'dan kaldır
    } catch (error) {
      console.error('Remove from favorites error:', error)
      commit('SET_ERROR', 'Favorilerden kaldırılırken bir hata oluştu')
    }
  }
}

export const favorites: Module<FavoritesState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 