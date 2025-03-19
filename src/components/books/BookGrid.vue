<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import BookCard from './BookCard.vue'

const store = useStore()

const books = computed(() => store.getters['books/getFilteredBooks'] || [])
const isLoading = computed(() => store.state.books.loading)
const hasBooks = computed(() => books.value.length > 0)

defineProps<{
  viewMode: 'grid' | 'list'
}>()
</script>

<template>
  <div 
    :class="[
      'book-grid',
      `view-${viewMode}`,
      { loading: isLoading }
    ]"
  >
    <div v-if="isLoading" class="loading-spinner">
      Yükleniyor...
    </div>
    
    <template v-else>
      <div v-if="hasBooks" class="books-container">
        <BookCard
          v-for="book in books"
          :key="book.id"
          :book="book"
        />
      </div>
      
      <div v-else class="no-results">
        Kitap bulunamadı
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.book-grid {
  width: 100%;
}

.books-container {
  display: grid;
  gap: 2rem;
}

.book-grid.view-grid .books-container {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.book-grid.view-list .books-container {
  grid-template-columns: 1fr;
}

.book-grid.loading {
  display: grid;
  place-items: center;
  min-height: 400px;
}

.loading-spinner {
  color: var(--color-text-light);
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .book-grid.view-grid .books-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style> 