<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import type { Book } from '@/types/book'

const props = defineProps<{
  book: Book
}>()

const store = useStore()
const defaultImage = '/images/books/placeholder.jpg'

const formattedPrice = computed(() => {
  const selectedCurrency = store.getters['currency/getSelectedCurrency']
  const rate = store.getters['currency/getRate'](selectedCurrency)
  const price = props.book.price * rate

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: selectedCurrency
  }).format(price)
})

const isFavorite = computed(() => props.book.isFavorite)

const toggleFavorite = () => {
  store.dispatch('books/toggleFavorite', props.book.id)
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = defaultImage
}
</script>

<template>
  <div class="book-card">
    <router-link :to="{ name: 'book-detail', params: { id: book.id }}" class="book-link">
      <div class="book-image">
        <img 
          :src="book.coverImage" 
          :alt="book.title"
          class="book-cover"
          @error="handleImageError"
        />
      </div>
      
      <div class="book-info">
        <h3 class="book-title">{{ book.title }}</h3>
        <p class="book-author">{{ book.author }}</p>
        <p class="book-description">{{ book.description }}</p>
        <p class="book-price">{{ formattedPrice }}</p>
        
        <div class="book-rating">
          <div class="stars">
            <i class="fas fa-star" v-for="n in Math.floor(book.rating)" :key="n"></i>
            <i class="fas fa-star-half-alt" v-if="book.rating % 1 >= 0.5"></i>
          </div>
          <span class="rating-value">({{ book.rating }})</span>
        </div>
      </div>
    </router-link>

    <button 
      class="favorite-button"
      @click="toggleFavorite"
      :class="{ active: isFavorite }"
    >
      <i class="fas fa-heart"></i>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.book-card {
  background: var(--color-background-soft);
  border-radius: $border-radius;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.book-image {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: #f5f5f5;
  max-height: 280px;
  
  .book-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.favorite-button {
  position: absolute;
  top: $spacing-2;
  right: $spacing-2;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #999;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
  
  &.active {
    background: white;
    color: #ff4757;
  }
  
  &:hover {
    transform: scale(1.1);
    color: #ff4757;
  }
}

.book-info {
  padding: $spacing-3;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .book-title {
    font-size: $font-size-base;
    margin: 0 0 $spacing-1;
    font-weight: $font-weight-bold;
    color: var(--color-heading);
  }
  
  .book-author {
    font-size: $font-size-sm;
    margin: 0 0 $spacing-1;
    color: var(--color-text-light);
  }
  
  .book-description {
    font-size: $font-size-sm;
    margin: 0 0 $spacing-2;
    color: var(--color-text);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }
  
  .book-price {
    font-size: $font-size-base;
    margin: 0 0 $spacing-2;
    font-weight: $font-weight-bold;
    color: var(--color-primary);
  }

  .book-rating {
    margin-bottom: $spacing-2;
    display: flex;
    align-items: center;
    gap: $spacing-1;
    
    .stars {
      color: #ffd700;
      font-size: $font-size-sm;
    }

    .rating-value {
      color: var(--color-text-light);
      font-size: $font-size-sm;
    }
  }
}

.book-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style> 