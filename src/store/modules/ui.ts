// @ts-ignore
import { Module } from 'vuex'
import { RootState, UIState } from '../types'

const state = (): UIState => ({
  theme: localStorage.getItem('theme') as 'light' | 'dark' || 'light'
})

const getters = {
  currentTheme: (state: UIState): string => state.theme
}

const mutations = {
  SET_THEME(state: UIState, theme: 'light' | 'dark') {
    state.theme = theme
  }
}

const actions = {
  async initialize({ commit }: any) {
    try {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'light' || savedTheme === 'dark') {
        commit('SET_THEME', savedTheme)
      }
    } catch (error) {
      console.error('UI initialize error:', error)
    }
  },

  toggleTheme({ commit, state }: any) {
    const newTheme = state.theme === 'light' ? 'dark' : 'light'
    commit('SET_THEME', newTheme)
    localStorage.setItem('theme', newTheme)
  }
}

export const ui: Module<UIState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 