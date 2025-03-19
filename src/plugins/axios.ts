import axios from 'axios'
import store from '@/store'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.state.auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      store.dispatch('auth/logout')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance 