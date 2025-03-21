import { computed } from 'vue'
import { useStore } from 'vuex'
import type { Book } from '@/types'

export function useBook(book: Book) {
  const store = useStore()

  const formattedPrice = computed(() => {
    return store.dispatch('currency/formatPrice', book.price)
  })

  const formattedRating = computed(() => {
    return `${book.rating}/5`
  })

  const formattedPublishDate = computed(() => {
    return book.publishDate 
      ? new Date(book.publishDate).toLocaleDateString('tr-TR') 
      : book.publishYear.toString()
  })

  const stockCode = computed(() => {
    return `KTP${book.id.toString().padStart(5, '0')}`
  })

  const isAvailable = computed(() => {
    return book.isFree ? 'Ücretsiz' : 'Satışta'
  })

  const toggleFavorite = async () => {
    try {
      await store.dispatch('books/toggleFavorite', book.id)
    } catch (error) {
      console.error('Favori durumu güncellenirken hata:', error)
    }
  }

  return {
    formattedPrice,
    formattedRating,
    formattedPublishDate,
    stockCode,
    isAvailable,
    toggleFavorite
  }
} 