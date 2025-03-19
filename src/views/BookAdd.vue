<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BookForm from '@/components/books/BookForm.vue'

const router = useRouter()
const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // Kitap ekleme işlemi
    router.push('/profile')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="book-add-view">
    <h1>Yeni Kitap Ekle</h1>
    <BookForm />
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