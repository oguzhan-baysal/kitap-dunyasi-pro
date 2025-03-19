<script setup lang="ts">
import BookCarousel from '@/components/books/BookCarousel.vue'
import BookGrid from '@/components/books/BookGrid.vue'
</script>

<template>
  <div class="home">
    <BookCarousel />
    <BookGrid />
  </div>
</template>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}
</style> 