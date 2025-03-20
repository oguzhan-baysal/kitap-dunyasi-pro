<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import BookForm from '@/components/books/BookForm.vue'
import type { Book } from '@/types/book'

const router = useRouter()
const store = useStore()
const isSubmitting = ref(false)

const handleSubmit = async (bookData: Book) => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    await store.dispatch('books/addBook', bookData)
    router.push('/profile')
  } catch (err) {
    console.error('Kitap eklenirken hata:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="book-add-view">
    <h1>Yeni Kitap Ekle</h1>
    <BookForm @submit="handleSubmit" />
  </div>
</template>

<style lang="scss" scoped>
.book-add-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    margin: 0 0 2rem;
    font-size: 2rem;
  }
}
</style> 