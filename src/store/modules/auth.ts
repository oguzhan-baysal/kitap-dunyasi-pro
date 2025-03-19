import { Module } from 'vuex'
import { RootState } from '../types'
import router from '@/router'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData extends LoginCredentials {
  name: string
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
  error: (state: AuthState): string | null => state.error
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
  async login({ commit }: any, credentials: LoginCredentials) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      // Simüle edilmiş login
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Demo kullanıcı
      const demoUser: User = {
        id: '1',
        name: 'Demo Kullanıcı',
        email: credentials.email
      }

      const demoToken = 'demo-token-' + Math.random()

      commit('SET_USER', demoUser)
      commit('SET_TOKEN', demoToken)

      // Kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(demoUser))
      localStorage.setItem('token', demoToken)

      router.push('/')
    } catch (err) {
      commit('SET_ERROR', 'Giriş yapılırken bir hata oluştu')
      console.error('Login error:', err)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async register({ commit }: any, data: RegisterData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      // Simüle edilmiş kayıt
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email
      }

      const newToken = 'demo-token-' + Math.random()

      commit('SET_USER', newUser)
      commit('SET_TOKEN', newToken)

      localStorage.setItem('user', JSON.stringify(newUser))
      localStorage.setItem('token', newToken)

      router.push('/')
    } catch (err) {
      commit('SET_ERROR', 'Kayıt olurken bir hata oluştu')
      console.error('Register error:', err)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  logout({ commit }: any) {
    commit('SET_USER', null)
    commit('SET_TOKEN', null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/login')
  },

  async updateProfile({ commit, state }: any, updates: Partial<User>) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      // Simüle edilmiş profil güncelleme
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (state.user) {
        const updatedUser = { ...state.user, ...updates }
        commit('SET_USER', updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (err) {
      commit('SET_ERROR', 'Profil güncellenirken bir hata oluştu')
      console.error('Update profile error:', err)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async forgotPassword({ commit }: any, email: string) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      // Simüle edilmiş şifre sıfırlama
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Başarılı olduğunu varsayalım
      return true
    } catch (err) {
      commit('SET_ERROR', 'Şifre sıfırlama işlemi başarısız oldu')
      console.error('Forgot password error:', err)
      return false
    } finally {
      commit('SET_LOADING', false)
    }
  },

  initializeFromStorage({ commit }: any) {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken) {
      commit('SET_TOKEN', storedToken)
    }

    if (storedUser) {
      try {
        commit('SET_USER', JSON.parse(storedUser))
      } catch (err) {
        console.error('Stored user parse error:', err)
        localStorage.removeItem('user')
      }
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