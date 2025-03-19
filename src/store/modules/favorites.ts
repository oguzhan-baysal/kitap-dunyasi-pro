import { Module, ActionContext } from 'vuex'
import type { RootState, FavoritesState } from '../types'

const state = (): FavoritesState => ({
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]')
})

const getters = {
  isFavorite: (state: FavoritesState) => (bookId: string) => {
    return state.favorites.includes(bookId)
  }
}

const mutations = {
  ADD_FAVORITE(state: FavoritesState, bookId: string) {
    state.favorites.push(bookId)
  },
  REMOVE_FAVORITE(state: FavoritesState, bookId: string) {
    state.favorites = state.favorites.filter(id => id !== bookId)
  }
}

type FavoritesActionContext = ActionContext<FavoritesState, RootState>

const actions = {
  addFavorite({ commit, state }: FavoritesActionContext, bookId: string) {
    commit('ADD_FAVORITE', bookId)
    localStorage.setItem('favorites', JSON.stringify(state.favorites))
  },

  removeFavorite({ commit, state }: FavoritesActionContext, bookId: string) {
    commit('REMOVE_FAVORITE', bookId)
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