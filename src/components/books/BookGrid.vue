<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { RootState } from '@/store/types'
import BookCard from './BookCard.vue'

const store = useStore<RootState>()

const searchQuery = ref('')
const selectedCategory = ref('')
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)

const books = computed(() => store.getters['books/getFilteredBooks'] || [])
const isLoading = computed(() => store.state.books.loading)
const hasBooks = computed(() => books.value.length > 0)

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  minPrice.value = null
  maxPrice.value = null
  store.dispatch('books/updateFilters', {
    category: null,
    priceRange: { min: 0, max: 1000 },
    searchQuery: ''
  })
}

// Filtreleri store'a gönder
watch([searchQuery, selectedCategory, minPrice, maxPrice], () => {
  store.dispatch('books/updateFilters', {
    category: selectedCategory.value || null,
    priceRange: {
      min: minPrice.value || 0,
      max: maxPrice.value || 1000
    },
    searchQuery: searchQuery.value
  })
}, { deep: true })
</script>

<template>
  <div class="book-grid-container">
    <!-- Filtreler Bölümü -->
    <section class="filters-section">
      <form class="filter-form" @submit.prevent>
        <div class="filter-group">
          <label for="search">Kitap Ara</label>
          <input
            id="search"
            type="text"
            v-model="searchQuery"
            placeholder="Kitap adı, yazar veya açıklama..."
          >
        </div>

        <div class="filter-group">
          <label for="category">Kategori</label>
          <select id="category" v-model="selectedCategory">
            <option value="">Tümü</option>
            <option value="Roman">Roman</option>
            <option value="Bilim">Bilim</option>
            <option value="Tarih">Tarih</option>
            <option value="Çocuk">Çocuk</option>
            <option value="Kişisel Gelişim">Kişisel Gelişim</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Fiyat Aralığı</label>
          <div class="price-range">
            <input
              type="number"
              v-model="minPrice"
              placeholder="Min"
              min="0"
            >
            <input
              type="number"
              v-model="maxPrice"
              placeholder="Max"
              min="0"
            >
          </div>
        </div>

        <div class="filter-actions">
          <button class="filter-button" @click="resetFilters">
            Filtreleri Temizle
          </button>
        </div>
      </form>
    </section>

    <!-- Kitaplar Grid -->
    <div v-if="isLoading" class="loading">
      Yükleniyor...
    </div>
    <div v-else-if="hasBooks" class="books-grid">
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
      />
    </div>
    <div v-else class="no-results">
      Aradığınız kriterlere uygun kitap bulunamadı.
    </div>
  </div>
</template>

<style lang="scss" scoped>
.book-grid-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
}

.filters-section {
  background-color: var(--color-bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.filter-group input,
.filter-group select {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
}

.price-range {
  display: flex;
  gap: 1rem;
}

.price-range input {
  width: 100%;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.filter-button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-primary-dark);
  }
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .book-grid.view-grid .books-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style> 