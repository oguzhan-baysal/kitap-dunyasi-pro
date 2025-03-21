// @ts-ignore
import { Module, Commit, Dispatch } from 'vuex'
import { RootState } from '../types'
import router from '@/router'
import type { User } from '../types'
import { 
  secureStorage, 
  RateLimiter, 
  generateCSRFToken,
  hashPassword,
  verifyPassword
} from '@/utils/security'

// Rate limiter instance
const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000) // 5 deneme, 15 dakika blok

// Mock user database
const mockUserDB = new Map<string, { user: User; hashedPassword: string }>()

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  tokenExpiresAt: number
  loading: boolean
  error: string | null
  csrfToken: string | null
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
  USER: 'kitap_dunyasi_user',
  CSRF_TOKEN: 'kitap_dunyasi_csrf_token'
} as const

// Token süreleri (milisaniye)
const TOKEN_DURATION = {
  ACCESS: 1 * 60 * 60 * 1000, // 1 saat
  REFRESH: 7 * 24 * 60 * 60 * 1000 // 7 gün
}

const state: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  tokenExpiresAt: 0,
  loading: false,
  error: null,
  csrfToken: null
}

const getters = {
  isAuthenticated: (state: AuthState) => !!state.token,
  isLoggedIn: (state: AuthState) => !!state.token,
  user: (state: AuthState) => state.user,
  loading: (state: AuthState) => state.loading,
  error: (state: AuthState) => state.error,
  csrfToken: (state: AuthState) => state.csrfToken
}

const mutations = {
  SET_USER(state: AuthState, user: User | null) {
    state.user = user
    secureStorage.setItem(STORAGE_KEYS.USER, user)
  },
  
  SET_TOKEN(state: AuthState, token: string | null) {
    state.token = token
    if (token) {
      secureStorage.setItem(STORAGE_KEYS.TOKEN, token)
    } else {
      secureStorage.removeItem(STORAGE_KEYS.TOKEN)
    }
  },
  
  SET_REFRESH_TOKEN(state: AuthState, token: string | null) {
    state.refreshToken = token
    if (token) {
      secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token)
    } else {
      secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    }
  },
  
  SET_TOKEN_EXPIRES_AT(state: AuthState, timestamp: number) {
    state.tokenExpiresAt = timestamp
    secureStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, timestamp)
  },
  
  SET_LOADING(state: AuthState, loading: boolean) {
    state.loading = loading
  },
  
  SET_ERROR(state: AuthState, error: string | null) {
    state.error = error
  },
  
  SET_CSRF_TOKEN(state: AuthState, token: string | null) {
    state.csrfToken = token
    if (token) {
      secureStorage.setItem(STORAGE_KEYS.CSRF_TOKEN, token)
    } else {
      secureStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN)
    }
  },
  
  CLEAR_AUTH(state: AuthState) {
    state.user = null
    state.token = null
    state.refreshToken = null
    state.tokenExpiresAt = 0
    state.error = null
    state.csrfToken = null
    Object.values(STORAGE_KEYS).forEach(key => secureStorage.removeItem(key))
  }
}

const actions = {
  async login({ commit }: { commit: Commit }, credentials: LoginCredentials) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    // Rate limiting kontrolü
    const key = `login_${credentials.email}`
    if (loginRateLimiter.isBlocked(key)) {
      const remainingTime = Math.ceil(loginRateLimiter.getBlockTimeRemaining(key) / 1000)
      commit('SET_ERROR', `Çok fazla başarısız deneme. Lütfen ${remainingTime} saniye sonra tekrar deneyin.`)
      commit('SET_LOADING', false)
      return { success: false }
    }
    
    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock kullanıcı kontrolü
      const userRecord = mockUserDB.get(credentials.email)
      if (!userRecord || !verifyPassword(credentials.password, userRecord.hashedPassword)) {
        throw new Error('Geçersiz email veya şifre')
      }

      const tokenData: TokenData = {
        token: 'mock_token_' + Date.now(),
        refreshToken: 'mock_refresh_' + Date.now(),
        expiresAt: Date.now() + TOKEN_DURATION.ACCESS
      }

      // CSRF token oluştur
      const csrfToken = generateCSRFToken()
      commit('SET_CSRF_TOKEN', csrfToken)
      
      commit('SET_USER', userRecord.user)
      commit('SET_TOKEN', tokenData.token)
      commit('SET_REFRESH_TOKEN', tokenData.refreshToken)
      commit('SET_TOKEN_EXPIRES_AT', tokenData.expiresAt)
      
      // Başarılı giriş - rate limiter sıfırla
      loginRateLimiter.reset(key)
      
      return { success: true }
    } catch (error) {
      // Başarısız giriş - deneme sayısını artır
      loginRateLimiter.recordAttempt(key)
      
      const remainingAttempts = loginRateLimiter.getRemainingAttempts(key)
      const errorMessage = remainingAttempts > 0
        ? `Giriş başarısız. ${remainingAttempts} deneme hakkınız kaldı.`
        : 'Çok fazla başarısız deneme. Hesabınız geçici olarak bloke edildi.'
      
      commit('SET_ERROR', errorMessage)
      return { success: false, error }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async register({ commit }: { commit: Commit }, credentials: RegisterCredentials) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const hashedPassword = hashPassword(credentials.password)
      
      const mockUser: User = {
        id: Date.now(),
        name: credentials.name,
        email: credentials.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Mock DB'ye kaydet
      mockUserDB.set(credentials.email, {
        user: mockUser,
        hashedPassword
      })

      const tokenData: TokenData = {
        token: 'mock_token_' + Date.now(),
        refreshToken: 'mock_refresh_' + Date.now(),
        expiresAt: Date.now() + TOKEN_DURATION.ACCESS
      }

      // CSRF token oluştur
      const csrfToken = generateCSRFToken()
      commit('SET_CSRF_TOKEN', csrfToken)
      
      commit('SET_USER', mockUser)
      commit('SET_TOKEN', tokenData.token)
      commit('SET_REFRESH_TOKEN', tokenData.refreshToken)
      commit('SET_TOKEN_EXPIRES_AT', tokenData.expiresAt)
      router.push('/profile')
    } catch (error) {
      commit('SET_ERROR', 'Kayıt başarısız oldu')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  logout({ commit }: { commit: Commit }) {
    commit('CLEAR_AUTH')
    router.push('/login')
  },

  async checkAuth({ commit, state }: { commit: Commit; state: AuthState }) {
    if (!state.token || state.tokenExpiresAt <= Date.now()) {
      commit('SET_TOKEN', null)
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
        commit('SET_TOKEN', tokenData.token)
        commit('SET_REFRESH_TOKEN', tokenData.refreshToken)
        commit('SET_TOKEN_EXPIRES_AT', tokenData.expiresAt)
        
        // CSRF token'ı da yenile
        const csrfToken = generateCSRFToken()
        commit('SET_CSRF_TOKEN', csrfToken)
      }
      return true
    } catch (error) {
      commit('SET_ERROR', 'Token yenileme başarısız oldu')
      commit('SET_TOKEN', null)
      commit('SET_REFRESH_TOKEN', null)
      commit('SET_TOKEN_EXPIRES_AT', 0)
      commit('SET_CSRF_TOKEN', null)
      return false
    }
  },

  initializeAuth({ commit }: { commit: Commit }) {
    const auth = localStorage.getItem('auth')
    if (auth) {
      const { user, token, refreshToken, tokenExpiresAt } = JSON.parse(auth)
      commit('SET_USER', user)
      commit('SET_TOKEN', token)
      commit('SET_REFRESH_TOKEN', refreshToken)
      commit('SET_TOKEN_EXPIRES_AT', tokenExpiresAt)
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