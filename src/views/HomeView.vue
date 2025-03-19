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
  padding: $spacing-large;
}

.content {
  margin-top: $spacing-large;
  display: grid;
  gap: $spacing-large;
  grid-template-columns: 300px 1fr;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
  }
}

.book-filter {
  background: var(--color-card-bg);
  padding: $spacing-medium;
  border-radius: $border-radius;
  height: fit-content;
  box-shadow: $box-shadow;
}

.book-grid {
  min-height: 500px;
}
</style> 