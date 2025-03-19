// @ts-ignore
import { Module } from 'vuex'
import { RootState, FavoritesState } from '../types'

const state = (): FavoritesState => ({
  favorites: []
})

const getters = {
  allFavorites: (state: FavoritesState): number[] => state.favorites,
  isFavorite: (state: FavoritesState) => (bookId: number): boolean => 
    state.favorites.includes(bookId)
}

const mutations = {
  SET_FAVORITES(state: FavoritesState, favorites: number[]) {
    state.favorites = favorites
  },
  ADD_FAVORITE(state: FavoritesState, bookId: number) {
    if (!state.favorites.includes(bookId)) {
      state.favorites.push(bookId)
    }
  },
  REMOVE_FAVORITE(state: FavoritesState, bookId: number) {
    state.favorites = state.favorites.filter(id => id !== bookId)
  }
}

const actions = {
  async initialize({ commit }: any) {
    try {
      const savedFavorites = localStorage.getItem('favorites')
      if (savedFavorites) {
        commit('SET_FAVORITES', JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error('Favorites initialize error:', error)
    }
  },

  toggleFavorite({ commit, state }: any, bookId: number) {
    if (state.favorites.includes(bookId)) {
      commit('REMOVE_FAVORITE', bookId)
    } else {
      commit('ADD_FAVORITE', bookId)
    }
    localStorage.setItem('favorites', JSON.stringify(state.favorites))
  }
}

export const favorites: Module<FavoritesState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 