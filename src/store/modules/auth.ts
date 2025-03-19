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
  token: null,
  refreshToken: null,
  tokenExpiresAt: null,
  loading: false,
  error: null
})

const getters = {
  isAuthenticated: (state: AuthState): boolean => !!state.token,
  currentUser: (state: AuthState) => state.user,
  loading: (state: AuthState): boolean => state.loading,
  error: (state: AuthState): string | null => state.error,
  isTokenExpired: (state: AuthState): boolean => {
    if (!state.tokenExpiresAt) return true
    return Date.now() >= state.tokenExpiresAt
  }
}

const mutations = {
  SET_USER(state: AuthState, user: AuthState['user']) {
    state.user = user
  },
  SET_TOKEN_DATA(state: AuthState, data: TokenData) {
    state.token = data.token
    state.refreshToken = data.refreshToken
    state.tokenExpiresAt = data.expiresAt
  },
  SET_LOADING(state: AuthState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: AuthState, error: string | null) {
    state.error = error
  },
  CLEAR_AUTH(state: AuthState) {
    state.user = null
    state.token = null
    state.refreshToken = null
    state.tokenExpiresAt = null
    state.error = null
  }
}

const actions = {
  async login({ commit, dispatch }: AuthContext, credentials: LoginCredentials) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      // Mock API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        const user = {
          id: 1,
          name: 'Test Kullanıcı',
          email: 'test@example.com'
        }
        
        const tokenData: TokenData = {
          token: 'mock_jwt_token',
          refreshToken: 'mock_refresh_token',
          expiresAt: Date.now() + TOKEN_DURATION.ACCESS
        }

        commit('SET_USER', user)
        commit('SET_TOKEN_DATA', tokenData)

        // Token verilerini localStorage'a kaydet
        storage.setItem(STORAGE_KEYS.USER, user)
        storage.setItem(STORAGE_KEYS.TOKEN, tokenData.token)
        storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken)
        storage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, tokenData.expiresAt)

        // Token yenileme zamanlayıcısını başlat
        dispatch('startTokenRefreshTimer')
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

  async register({ commit, dispatch }: AuthContext, credentials: RegisterCredentials) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const user = {
        id: Date.now(),
        name: credentials.name,
        email: credentials.email
      }

      const tokenData: TokenData = {
        token: 'mock_jwt_token',
        refreshToken: 'mock_refresh_token',
        expiresAt: Date.now() + TOKEN_DURATION.ACCESS
      }

      commit('SET_USER', user)
      commit('SET_TOKEN_DATA', tokenData)

      storage.setItem(STORAGE_KEYS.USER, user)
      storage.setItem(STORAGE_KEYS.TOKEN, tokenData.token)
      storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken)
      storage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, tokenData.expiresAt)

      dispatch('startTokenRefreshTimer')
    } catch (error) {
      commit('SET_ERROR', error instanceof Error ? error.message : 'Kayıt olurken bir hata oluştu')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async logout({ commit }: AuthContext) {
    storage.clear()
    commit('CLEAR_AUTH')
    router.push('/login')
  },

  async checkAuth({ commit, dispatch, getters }: AuthContext) {
    const token = storage.getItem<string>(STORAGE_KEYS.TOKEN)
    const refreshToken = storage.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN)
    const expiresAt = storage.getItem<number>(STORAGE_KEYS.TOKEN_EXPIRY)
    const user = storage.getItem(STORAGE_KEYS.USER)

    if (token && refreshToken && expiresAt && user) {
      commit('SET_TOKEN_DATA', { token, refreshToken, expiresAt })
      commit('SET_USER', user)

      // Token süresi dolmuşsa yenile
      if (getters.isTokenExpired) {
        await dispatch('refreshToken')
      } else {
        dispatch('startTokenRefreshTimer')
      }
    }
  },

  async refreshToken({ commit, state }: AuthContext) {
    if (!state.refreshToken) {
      throw new Error('Refresh token bulunamadı')
    }

    try {
      // Mock API çağrısı
      await new Promise(resolve => setTimeout(resolve, 500))

      const tokenData: TokenData = {
        token: 'new_mock_jwt_token',
        refreshToken: state.refreshToken,
        expiresAt: Date.now() + TOKEN_DURATION.ACCESS
      }

      commit('SET_TOKEN_DATA', tokenData)

      storage.setItem(STORAGE_KEYS.TOKEN, tokenData.token)
      storage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, tokenData.expiresAt)

      return tokenData
    } catch (error) {
      commit('SET_ERROR', 'Token yenilenirken hata oluştu')
      throw error
    }
  },

  startTokenRefreshTimer({ dispatch, getters }: AuthContext) {
    // Her 5 dakikada bir token kontrolü yap
    setInterval(async () => {
      if (getters.isTokenExpired) {
        try {
          await dispatch('refreshToken')
        } catch (error) {
          // Refresh token hatası durumunda kullanıcıyı çıkış yaptır
          dispatch('logout')
        }
      }
    }, 5 * 60 * 1000)
  },

  async updateProfile({ commit, state }: AuthContext, data: UpdateProfileData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      // Mock API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updatedUser = {
        ...state.user,
        name: data.name,
        email: data.email
      }

      commit('SET_USER', updatedUser)
      storage.setItem(STORAGE_KEYS.USER, updatedUser)

      return { message: 'Profil başarıyla güncellendi' }
    } catch (error) {
      commit('SET_ERROR', error instanceof Error ? error.message : 'Profil güncellenirken bir hata oluştu')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async changePassword({ commit }: AuthContext, data: ChangePasswordData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      // Mock API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mevcut şifre kontrolü
      if (data.currentPassword !== 'password') {
        throw new Error('Mevcut şifre yanlış')
      }

      return { message: 'Şifre başarıyla değiştirildi' }
    } catch (error) {
      commit('SET_ERROR', error instanceof Error ? error.message : 'Şifre değiştirilirken bir hata oluştu')
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