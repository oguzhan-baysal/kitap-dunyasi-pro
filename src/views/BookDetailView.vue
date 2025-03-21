<template>
  <div class="book-detail-view">
    <BookInfo :book="currentBook" />
    <BookReviews :book="currentBook" />
    <RelatedBooks :currentBook="currentBook" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import BookInfo from '@/components/books/BookInfo.vue'
import BookReviews from '@/components/books/BookReviews.vue'
import RelatedBooks from '@/components/books/RelatedBooks.vue'

const store = useStore()
const route = useRoute()

const bookId = computed(() => route.params.id as string)
const currentBook = computed(() => store.getters['books/bookById'](bookId.value))
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