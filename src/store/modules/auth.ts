// @ts-ignore
import { Module, Commit, Dispatch } from 'vuex'
import { RootState, AuthState } from '../types'
import router from '@/router'

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
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  tokenExpiresAt: Number(localStorage.getItem('tokenExpiresAt')) || 0,
  loading: false,
  error: null
})

const getters = {
  isAuthenticated: (state: AuthState): boolean => !!state.token,
  currentUser: (state: AuthState) => state.user,
  loading: (state: AuthState): boolean => state.loading,
  error: (state: AuthState): string | null => state.error
}

const mutations = {
  SET_USER(state: AuthState, user: AuthState['user']) {
    state.user = user
  },
  SET_TOKEN(state: AuthState, token: string | null) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },
  SET_REFRESH_TOKEN(state: AuthState, refreshToken: string | null) {
    state.refreshToken = refreshToken
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    } else {
      localStorage.removeItem('refreshToken')
    }
  },
  SET_TOKEN_EXPIRES_AT(state: AuthState, expiresAt: number) {
    state.tokenExpiresAt = expiresAt
    localStorage.setItem('tokenExpiresAt', String(expiresAt))
  },
  SET_LOADING(state: AuthState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: AuthState, error: string | null) {
    state.error = error
  }
}

const actions = {
  async login({ commit }: { commit: Commit }, credentials: { email: string; password: string }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        const mockUser = {
          id: 1,
          email: credentials.email,
          name: 'Test Kullanıcı'
        }
        const mockToken = 'mock-jwt-token'
        const mockRefreshToken = 'mock-refresh-token'
        const expiresAt = Date.now() + TOKEN_DURATION.ACCESS
        
        commit('SET_USER', mockUser)
        commit('SET_TOKEN', mockToken)
        commit('SET_REFRESH_TOKEN', mockRefreshToken)
        commit('SET_TOKEN_EXPIRES_AT', expiresAt)
        return mockUser
      } else {
        throw new Error('Geçersiz e-posta veya şifre')
      }
    } catch (error) {
      commit('SET_ERROR', error instanceof Error ? error.message : 'Giriş yapılırken bir hata oluştu')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async register({ commit }: { commit: Commit }, userData: { email: string; password: string; name: string }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name
      }
      const mockToken = 'mock-jwt-token'
      const mockRefreshToken = 'mock-refresh-token'
      const expiresAt = Date.now() + TOKEN_DURATION.ACCESS
      
      commit('SET_USER', mockUser)
      commit('SET_TOKEN', mockToken)
      commit('SET_REFRESH_TOKEN', mockRefreshToken)
      commit('SET_TOKEN_EXPIRES_AT', expiresAt)
      return mockUser
    } catch (error) {
      commit('SET_ERROR', error instanceof Error ? error.message : 'Kayıt olurken bir hata oluştu')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async logout({ commit }: { commit: Commit }) {
    commit('SET_LOADING', true)
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 500))
      
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
      commit('SET_REFRESH_TOKEN', null)
      commit('SET_TOKEN_EXPIRES_AT', 0)
      storage.clear()
    } catch (error) {
      commit('SET_ERROR', error instanceof Error ? error.message : 'Çıkış yapılırken bir hata oluştu')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async checkAuth({ commit, state }: { commit: Commit; state: AuthState }) {
    if (!state.token) return null
    
    commit('SET_LOADING', true)
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Token varsa kullanıcı bilgilerini getir
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test Kullanıcı'
      }
      
      commit('SET_USER', mockUser)
      return mockUser
    } catch (error) {
      commit('SET_ERROR', error instanceof Error ? error.message : 'Kimlik doğrulama hatası')
      commit('SET_TOKEN', null)
      commit('SET_REFRESH_TOKEN', null)
      commit('SET_TOKEN_EXPIRES_AT', 0)
      commit('SET_USER', null)
      throw error
    } finally {
      commit('SET_LOADING', false)
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