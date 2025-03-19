<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

interface Book {
  id: string
  title: string
  author: string
  price: number
  coverImage: string
  description: string
  category: string
  language: string
  pageCount: number
  publishYear: number
}

const props = defineProps<{
  book: Book
}>()

const store = useStore()

const selectedCurrency = computed(() => store.state.currency.selectedCurrency)
const currencyRate = computed(() => store.getters['currency/getRate'](selectedCurrency.value))

const formattedPrice = computed(() => {
  const price = props.book.price * currencyRate.value
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: selectedCurrency.value
  }).format(price)
})

const isFavorite = computed(() => store.getters['favorites/isFavorite'](props.book.id))

const toggleFavorite = () => {
  if (isFavorite.value) {
    store.dispatch('favorites/removeFromFavorites', props.book.id)
  } else {
    store.dispatch('favorites/addToFavorites', props.book)
  }
}
</script>

<template>
  <div class="book-card">
    <div class="book-image">
      <img :src="book.coverImage" :alt="book.title">
      <button 
        class="favorite-button"
        :class="{ active: isFavorite }"
        @click="toggleFavorite"
      >
        ♥
      </button>
    </div>
    
    <div class="book-info">
      <h3>{{ book.title }}</h3>
      <p class="author">{{ book.author }}</p>
      <p class="price">{{ formattedPrice }}</p>
      
      <div class="book-actions">
        <router-link 
          :to="{ name: 'book-detail', params: { id: book.id }}"
          class="view-button"
        >
          İncele
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.book-card {
  background: var(--color-card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.book-image {
  position: relative;
  aspect-ratio: 2/3;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.favorite-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #ccc;
  cursor: pointer;
  transition: all 0.2s;
  
  &.active {
    background: var(--color-primary);
    color: white;
  }
  
  &:hover {
    transform: scale(1.1);
  }
}

.book-info {
  padding: 1rem;
  
  h3 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    line-height: 1.4;
  }
  
  .author {
    color: var(--color-text-light);
    font-size: 0.9rem;
    margin: 0 0 0.5rem;
  }
  
  .price {
    font-weight: 600;
    color: var(--color-primary);
    margin: 0 0 1rem;
  }
}

.book-actions {
  display: flex;
  gap: 0.5rem;
}

.view-button {
  flex: 1;
  padding: 0.5rem;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  text-align: center;
  transition: background 0.2s;
  
  &:hover {
    background: var(--color-primary-dark);
  }
}
</style> 