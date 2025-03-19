<template>
  <div class="book-detail-view">
    <BookInfo />
    <BookReviews />
    <RelatedBooks />
  </div>
</template>

<script setup lang="ts">
import BookInfo from '@/components/books/BookInfo.vue'
import BookReviews from '@/components/books/BookReviews.vue'
import RelatedBooks from '@/components/books/RelatedBooks.vue'
</script>

<style lang="scss" scoped>
.book-detail-view {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style> 