import type { Module } from 'vuex'
import type { RootState, UIState } from '@/types'

const state: UIState = {
  theme: 'light'
}

const ui: Module<UIState, RootState> = {
  namespaced: true,
  state,
  getters: {
    currentTheme: (state) => state.theme
  },
  mutations: {
    SET_THEME(state, theme: 'light' | 'dark') {
      state.theme = theme
    }
  },
  actions: {
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      commit('SET_THEME', newTheme)
      localStorage.setItem('theme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
    },
    
    initializeTheme({ commit }) {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light'
      commit('SET_THEME', savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }
}

export default ui 