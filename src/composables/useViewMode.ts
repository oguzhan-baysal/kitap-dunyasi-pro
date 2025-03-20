import { ref } from 'vue'

type ViewMode = 'grid' | 'list'

export function useViewMode(defaultMode: ViewMode = 'grid') {
  const viewMode = ref<ViewMode>(defaultMode)

  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  }

  const setViewMode = (mode: ViewMode) => {
    viewMode.value = mode
  }

  return {
    viewMode,
    toggleViewMode,
    setViewMode
  }
} 