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

const state = (): AuthState => ({
  user: secureStorage.getItem(STORAGE_KEYS.USER),
  token: secureStorage.getItem(STORAGE_KEYS.TOKEN),
  refreshToken: secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  tokenExpiresAt: secureStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY) || 0,
  loading: false,
  error: null,
  csrfToken: secureStorage.getItem(STORAGE_KEYS.CSRF_TOKEN)
})

const getters = {
  isAuthenticated: (state: AuthState) => !!state.token,
  isLoggedIn: (state: AuthState) => !!state.token,
  user: (state: AuthState) => state.user,
  loading: (state: AuthState) => state.loading,
  error: (state: AuthState) => state.error,
  csrfToken: (state: AuthState) => state.csrfToken
}

const mutations = {
  setUser(state: AuthState, user: User | null) {
    state.user = user
    secureStorage.setItem(STORAGE_KEYS.USER, user)
  },
  
  setToken(state: AuthState, tokenData: TokenData | null) {
    if (tokenData) {
      state.token = tokenData.token
      state.refreshToken = tokenData.refreshToken
      state.tokenExpiresAt = tokenData.expiresAt
      secureStorage.setItem(STORAGE_KEYS.TOKEN, tokenData.token)
      secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken)
      secureStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, tokenData.expiresAt)
    } else {
      state.token = null
      state.refreshToken = null
      state.tokenExpiresAt = 0
      Object.values(STORAGE_KEYS).forEach(key => secureStorage.removeItem(key))
    }
  },
  
  setLoading(state: AuthState, loading: boolean) {
    state.loading = loading
  },
  
  setError(state: AuthState, error: string | null) {
    state.error = error
  },
  
  setCSRFToken(state: AuthState, token: string | null) {
    state.csrfToken = token
    if (token) {
      secureStorage.setItem(STORAGE_KEYS.CSRF_TOKEN, token)
    } else {
      secureStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN)
    }
  }
}

const actions = {
  async login({ commit }: { commit: Commit }, credentials: LoginCredentials) {
    commit('setLoading', true)
    commit('setError', null)
    
    // Rate limiting kontrolü
    const key = `login_${credentials.email}`
    if (loginRateLimiter.isBlocked(key)) {
      const remainingTime = Math.ceil(loginRateLimiter.getBlockTimeRemaining(key) / 1000)
      commit('setError', `Çok fazla başarısız deneme. Lütfen ${remainingTime} saniye sonra tekrar deneyin.`)
      commit('setLoading', false)
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
      commit('setCSRFToken', csrfToken)
      
      commit('setUser', userRecord.user)
      commit('setToken', tokenData)
      
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
      
      commit('setError', errorMessage)
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
      
      // Şifreyi hash'le
      const hashedPassword = hashPassword(credentials.password)
      
      const mockUser: User = {
        id: Date.now(),
        name: credentials.name,
        email: credentials.email
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
      commit('setCSRFToken', csrfToken)
      
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
    commit('setCSRFToken', null)
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
        
        // CSRF token'ı da yenile
        const csrfToken = generateCSRFToken()
        commit('setCSRFToken', csrfToken)
      }
      return true
    } catch (error) {
      commit('setError', 'Token yenileme başarısız oldu')
      commit('setToken', null)
      commit('setCSRFToken', null)
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