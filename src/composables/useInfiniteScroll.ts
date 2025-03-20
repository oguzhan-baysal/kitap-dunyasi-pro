import { ref, onMounted, onUnmounted } from 'vue'

export function useInfiniteScroll(callback: () => Promise<void>, options = {
  threshold: 100, // Sayfa sonuna ne kadar kala yükleme başlasın
  throttle: 200   // Kaç ms'de bir kontrol edilsin
}) {
  const isLoading = ref(false)

  let throttleTimer: number | null = null

  const checkScroll = () => {
    if (throttleTimer) return

    throttleTimer = window.setTimeout(() => {
      const scrollPosition = window.scrollY + window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (documentHeight - scrollPosition <= options.threshold && !isLoading.value) {
        isLoading.value = true
        callback().finally(() => {
          isLoading.value = false
        })
      }

      throttleTimer = null
    }, options.throttle)
  }

  onMounted(() => {
    window.addEventListener('scroll', checkScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll)
    if (throttleTimer) {
      clearTimeout(throttleTimer)
    }
  })

  return {
    isLoading
  }
} 