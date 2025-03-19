// @ts-ignore
import { Module, Commit, ActionContext } from 'vuex'
import { RootState, AuthState, User } from '../types'
import router from '@/router'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData extends LoginCredentials {
  name: string
}

type AuthContext = ActionContext<AuthState, RootState>

// LocalStorage anahtar sabitleri
const STORAGE_KEYS = {
  TOKEN: 'kitap_dunyasi_token',
  USER: 'kitap_dunyasi_user'
} as const

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
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}

const state = (): AuthState => ({
  user: null,
  token: null,
  loading: false,
  error: null
})

const getters = {
  isAuthenticated: (state: AuthState): boolean => !!state.token,
  currentUser: (state: AuthState): User | null => state.user,
  isLoading: (state: AuthState): boolean => state.loading,
  hasError: (state: AuthState): boolean => !!state.error,
  getError: (state: AuthState): string | null => state.error
}

const mutations = {
  SET_USER(state: AuthState, user: User | null) {
    state.user = user
  },
  SET_TOKEN(state: AuthState, token: string | null) {
    state.token = token
  },
  SET_LOADING(state: AuthState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: AuthState, error: string | null) {
    state.error = error
  }
}

const actions = {
  async initializeFromStorage({ commit }: AuthContext): Promise<void> {
    try {
      const token = storage.getItem<string>(STORAGE_KEYS.TOKEN)
      const user = storage.getItem<User>(STORAGE_KEYS.USER)

      if (token && user) {
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
      } else {
        storage.clear()
      }
    } catch (error) {
      console.error('Auth initialize error:', error)
      commit('SET_ERROR', 'Oturum bilgileri yüklenirken bir hata oluştu')
      storage.clear()
    }
  },

  async login({ commit }: AuthContext, credentials: LoginCredentials): Promise<void> {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      // Simüle edilmiş login - gerçek API entegrasyonunda değiştirilecek
      await new Promise(resolve => setTimeout(resolve, 1000)) // API çağrısı simülasyonu

      const user: User = {
        id: 1,
        name: 'Test Kullanıcı',
        email: credentials.email
      }
      const token = 'dummy_token_' + Date.now()

      storage.setItem(STORAGE_KEYS.TOKEN, token)
      storage.setItem(STORAGE_KEYS.USER, user)

      commit('SET_USER', user)
      commit('SET_TOKEN', token)

      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      commit('SET_ERROR', 'Giriş yapılırken bir hata oluştu')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async logout({ commit }: AuthContext): Promise<void> {
    try {
      commit('SET_LOADING', true)
      
      // Simüle edilmiş logout - gerçek API entegrasyonunda değiştirilecek
      await new Promise(resolve => setTimeout(resolve, 500))

      storage.clear()
      
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
      commit('SET_ERROR', null)

      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      commit('SET_ERROR', 'Çıkış yapılırken bir hata oluştu')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async register({ commit }: AuthContext, data: RegisterData): Promise<void> {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      // Simüle edilmiş kayıt - gerçek API entegrasyonunda değiştirilecek
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Math.floor(Math.random() * 1000000),
        name: data.name,
        email: data.email
      }

      const token = 'dummy_token_' + Date.now()

      storage.setItem(STORAGE_KEYS.TOKEN, token)
      storage.setItem(STORAGE_KEYS.USER, newUser)

      commit('SET_USER', newUser)
      commit('SET_TOKEN', token)

      router.push('/')
    } catch (error) {
      console.error('Register error:', error)
      commit('SET_ERROR', 'Kayıt olurken bir hata oluştu')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateProfile({ commit, state }: AuthContext, updates: Partial<User>): Promise<void> {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      if (!state.user) {
        throw new Error('Kullanıcı bulunamadı')
      }

      // Simüle edilmiş profil güncelleme - gerçek API entegrasyonunda değiştirilecek
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updatedUser = { ...state.user, ...updates }
      
      storage.setItem(STORAGE_KEYS.USER, updatedUser)
      commit('SET_USER', updatedUser)

    } catch (error) {
      console.error('Update profile error:', error)
      commit('SET_ERROR', 'Profil güncellenirken bir hata oluştu')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async forgotPassword({ commit }: AuthContext, email: string): Promise<boolean> {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      // Email formatını kontrol et
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Geçersiz email formatı')
      }

      // Simüle edilmiş şifre sıfırlama - gerçek API entegrasyonunda değiştirilecek
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Email gönderildiğini simüle et
      console.log(`Şifre sıfırlama bağlantısı gönderildi: ${email}`)
      
      return true
    } catch (error) {
      console.error('Forgot password error:', error)
      commit('SET_ERROR', error instanceof Error ? error.message : 'Şifre sıfırlama işlemi başarısız oldu')
      return false
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