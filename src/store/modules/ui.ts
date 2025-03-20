import { Module, Commit } from 'vuex'
import { RootState } from '../types'

export interface UIState {
  theme: 'light' | 'dark'
}

const state = (): UIState => ({
  theme: 'light'
})

const getters = {
  currentTheme: (state: UIState) => state.theme,
  isDarkTheme: (state: UIState) => state.theme === 'dark'
}

const mutations = {
  setTheme(state: UIState, theme: 'light' | 'dark') {
    state.theme = theme
    // Tema değiştiğinde localStorage'a kaydet
    localStorage.setItem('theme', theme)
    // HTML elementine tema class'ını ekle
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }
}

const actions = {
  initTheme({ commit }: { commit: Commit }) {
    // Sayfa yüklendiğinde localStorage'dan temayı al
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      commit('setTheme', savedTheme)
    } else {
      // Sistem temasını kontrol et
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      commit('setTheme', prefersDark ? 'dark' : 'light')
    }
  },
  toggleTheme({ commit, state }: { commit: Commit, state: UIState }) {
    const newTheme = state.theme === 'light' ? 'dark' : 'light'
    commit('setTheme', newTheme)
  }
}

const ui: Module<UIState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default ui 