import { ref, watch } from 'vue'
import { useStore } from 'vuex'

export function useTheme() {
  const store = useStore()
  const theme = ref(localStorage.getItem('theme') || 'light')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    document.documentElement.setAttribute('data-theme', theme.value)
    store.commit('ui/SET_THEME', theme.value)
  }

  // Sayfa yüklendiğinde tema ayarını uygula
  const initTheme = () => {
    // Varsayılan olarak light mode başlat
    const savedTheme = localStorage.getItem('theme')
    if (!savedTheme) {
      localStorage.setItem('theme', 'light')
      theme.value = 'light'
    } else {
      theme.value = savedTheme
    }
    
    document.documentElement.setAttribute('data-theme', theme.value)
    store.commit('ui/SET_THEME', theme.value)
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
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    store.commit('ui/SET_THEME', newTheme)
  })

  return {
    theme,
    toggleTheme,
    initTheme,
    watchSystemTheme
  }
} 