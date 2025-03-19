<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import BookCard from './BookCard.vue'

const store = useStore()

const books = computed(() => store.getters['books/filteredBooks'])
const isLoading = computed(() => store.state.books.loading)

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
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
      />
      
      <div v-if="!books.length" class="no-results">
        Kitap bulunamadı
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.book-grid {
  display: grid;
  gap: 2rem;
  
  &.view-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  &.view-list {
    grid-template-columns: 1fr;
  }
  
  &.loading {
    place-items: center;
    min-height: 400px;
  }
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
</style> 