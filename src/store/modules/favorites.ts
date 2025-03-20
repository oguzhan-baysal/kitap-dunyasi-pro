// @ts-ignore
import { Module, Commit } from 'vuex'
import { RootState } from '../types'
import type { Book, FavoritesState } from '../types'

const STORAGE_KEY = 'kitap-dunyasi-favorites'

const state = (): FavoritesState => {
  // LocalStorage'dan favorileri al
  const savedFavorites = localStorage.getItem(STORAGE_KEY)
  return {
    favorites: savedFavorites ? JSON.parse(savedFavorites) : [],
    loading: false,
    error: null
  }
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
  setFavorites(state: FavoritesState, favorites: Book[]) {
    state.favorites = favorites
    // LocalStorage'a kaydet
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  },
  addFavorite(state: FavoritesState, book: Book) {
    state.favorites.push(book)
    // LocalStorage'a kaydet
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites))
  },
  removeFavorite(state: FavoritesState, bookId: number) {
    state.favorites = state.favorites.filter(book => book.id !== bookId)
    // LocalStorage'a kaydet
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites))
  },
  setLoading(state: FavoritesState, loading: boolean) {
    state.loading = loading
  },
  setError(state: FavoritesState, error: string | null) {
    state.error = error
  }
}

const actions = {
  async initFavorites({ commit }: { commit: Commit }) {
    try {
      commit('setLoading', true)
      const savedFavorites = localStorage.getItem(STORAGE_KEY)
      if (savedFavorites) {
        commit('setFavorites', JSON.parse(savedFavorites))
      }
      commit('setError', null)
    } catch (error) {
      commit('setError', 'Favoriler yüklenirken bir hata oluştu')
    } finally {
      commit('setLoading', false)
    }
  },

  async toggleFavorite({ commit, state }: { commit: Commit, state: FavoritesState }, book: Book) {
    try {
      commit('setLoading', true)
      const isFavorite = state.favorites.some(f => f.id === book.id)
      
      if (isFavorite) {
        commit('removeFavorite', book.id)
      } else {
        commit('addFavorite', book)
      }
      
      commit('setError', null)
    } catch (error) {
      commit('setError', 'Favori işlemi sırasında bir hata oluştu')
    } finally {
      commit('setLoading', false)
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