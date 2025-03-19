<template>
  <div class="book-form-view">
    <BookForm />
  </div>
</template>

<script setup lang="ts">
import BookForm from '@/components/books/BookForm.vue'
</script>

<style lang="scss" scoped>
.book-form-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}
</style> 