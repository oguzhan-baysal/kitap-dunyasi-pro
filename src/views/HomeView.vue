<script setup lang="ts">
import { ref } from 'vue'
import BookCarousel from '@/components/books/BookCarousel.vue'
import BookGrid from '@/components/books/BookGrid.vue'
import BookFilter from '@/components/books/BookFilter.vue'

const viewMode = ref<'grid' | 'list'>('grid')
</script>

<template>
  <div class="home-view">
    <BookCarousel />
    <div class="content">
      <BookFilter class="book-filter" />
      <BookGrid :view-mode="viewMode" class="book-grid" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  padding: 2rem;
}

.content {
  margin-top: 2rem;
  display: grid;
  gap: 2rem;
  grid-template-columns: 300px 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.book-filter {
  background: var(--color-card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  height: fit-content;
}

.book-grid {
  min-height: 500px;
}
</style> 