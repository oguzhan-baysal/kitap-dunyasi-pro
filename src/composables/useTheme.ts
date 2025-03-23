import { ref, watch } from 'vue'
import { useStore } from 'vuex'

export function useTheme() {
  const store = useStore()
  const theme = ref(localStorage.getItem('theme') || 'light')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(theme.value)
  }

  const applyTheme = (newTheme: string) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    store.commit('ui/SET_THEME', newTheme)
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    theme.value = savedTheme
    applyTheme(savedTheme)
  }

  // Sistem temasını takip et
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // Sistem temasını yoksay, her zaman light mode kullan
      const newTheme = 'light'
      theme.value = newTheme
      localStorage.setItem('theme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
      store.commit('ui/SET_THEME', newTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    handleChange(mediaQuery)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }

  // Tema değişikliklerini izle
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    theme,
    toggleTheme,
    initTheme,
    watchSystemTheme
  }
} 