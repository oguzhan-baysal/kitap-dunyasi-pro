// @ts-ignore
import { Module, Commit, Dispatch } from 'vuex'
import { RootState } from '../types'
import router from '@/router'
import type { User } from '../types'

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  tokenExpiresAt: number
  loading: boolean
  error: string | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  name: string
  email: string
  password: string
}

interface UpdateProfileData {
  name: string
  email: string
}

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

interface TokenData {
  token: string
  refreshToken: string
  expiresAt: number
}

interface AuthContext {
  commit: Commit
  dispatch: Dispatch
  state: AuthState
  getters: any
}

// LocalStorage anahtar sabitleri
const STORAGE_KEYS = {
  TOKEN: 'kitap_dunyasi_token',
  REFRESH_TOKEN: 'kitap_dunyasi_refresh_token',
  TOKEN_EXPIRY: 'kitap_dunyasi_token_expiry',
  USER: 'kitap_dunyasi_user'
} as const

// Token süreleri (milisaniye)
const TOKEN_DURATION = {
  ACCESS: 1 * 60 * 60 * 1000, // 1 saat
  REFRESH: 7 * 24 * 60 * 60 * 1000 // 7 gün
}

// LocalStorage yardımcı fonksiyonları
const storage = {
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Storage set error for ${key}:`, error)
    }
  },
  
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Storage get error for ${key}:`, error)
      return null
    }
  },
  
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Storage remove error for ${key}:`, error)
    }
  },
  
  clear(): void {
    try {
      (Object.values(STORAGE_KEYS) as string[]).forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}

const state = (): AuthState => ({
  user: null,
  token: storage.getItem(STORAGE_KEYS.TOKEN),
  refreshToken: storage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  tokenExpiresAt: storage.getItem(STORAGE_KEYS.TOKEN_EXPIRY) || 0,
  loading: false,
  error: null
})

const getters = {
  isAuthenticated: (state: AuthState) => !!state.token,
  isLoggedIn: (state: AuthState) => !!state.token,
  user: (state: AuthState) => state.user,
  loading: (state: AuthState) => state.loading,
  error: (state: AuthState) => state.error
}

const mutations = {
  setUser(state: AuthState, user: User | null) {
    state.user = user
    storage.setItem(STORAGE_KEYS.USER, user)
  },
  setToken(state: AuthState, tokenData: TokenData | null) {
    if (tokenData) {
      state.token = tokenData.token
      state.refreshToken = tokenData.refreshToken
      state.tokenExpiresAt = tokenData.expiresAt
      storage.setItem(STORAGE_KEYS.TOKEN, tokenData.token)
      storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken)
      storage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, tokenData.expiresAt)
    } else {
      state.token = null
      state.refreshToken = null
      state.tokenExpiresAt = 0
      storage.clear()
    }
  },
  setLoading(state: AuthState, loading: boolean) {
    state.loading = loading
  },
  setError(state: AuthState, error: string | null) {
    state.error = error
  }
}

const actions = {
  async login({ commit }: { commit: Commit }, credentials: LoginCredentials) {
    commit('setLoading', true)
    commit('setError', null)
    
    try {
      console.log('Login action başladı:', credentials.email)
      
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: credentials.email
      }

      const tokenData: TokenData = {
        token: 'mock_token_' + Date.now(),
        refreshToken: 'mock_refresh_' + Date.now(),
        expiresAt: Date.now() + TOKEN_DURATION.ACCESS
      }

      console.log('Login başarılı, kullanıcı bilgileri kaydediliyor...')
      commit('setUser', mockUser)
      commit('setToken', tokenData)
      
      return { success: true }
    } catch (error) {
      console.error('Login action hatası:', error)
      commit('setError', 'Giriş başarısız oldu')
      return { success: false, error }
    } finally {
      commit('setLoading', false)
    }
  },

  async register({ commit }: { commit: Commit }, credentials: RegisterCredentials) {
    commit('setLoading', true)
    commit('setError', null)

    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: Date.now(),
        name: credentials.name,
        email: credentials.email
      }

      const tokenData: TokenData = {
        token: 'mock_token_' + Date.now(),
        refreshToken: 'mock_refresh_' + Date.now(),
        expiresAt: Date.now() + TOKEN_DURATION.ACCESS
      }

      commit('setUser', mockUser)
      commit('setToken', tokenData)
      router.push('/profile')
    } catch (error) {
      commit('setError', 'Kayıt başarısız oldu')
    } finally {
      commit('setLoading', false)
    }
  },

  logout({ commit }: { commit: Commit }) {
    commit('setUser', null)
    commit('setToken', null)
    router.push('/login')
  },

  async checkAuth({ commit, state }: { commit: Commit; state: AuthState }) {
    if (!state.token || state.tokenExpiresAt <= Date.now()) {
      commit('setToken', null)
      return false
    }

    try {
      // Token yenileme simülasyonu
      if (state.tokenExpiresAt - Date.now() < TOKEN_DURATION.ACCESS / 2) {
        const tokenData: TokenData = {
          token: 'mock_token_' + Date.now(),
          refreshToken: state.refreshToken || 'mock_refresh_' + Date.now(),
          expiresAt: Date.now() + TOKEN_DURATION.ACCESS
        }
        commit('setToken', tokenData)
      }
      return true
    } catch (error) {
      commit('setError', 'Token yenileme başarısız oldu')
      commit('setToken', null)
      return false
    }
  }
}

export const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 