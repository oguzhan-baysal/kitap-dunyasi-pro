<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import type { Book } from '@/types/book'
import BookForm from '@/components/books/BookForm.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

const book = ref<Book | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const bookId = route.params.id
  if (bookId) {
    try {
      await store.dispatch('books/fetchBookDetails', parseInt(bookId as string))
      book.value = store.getters['books/getBookById'](parseInt(bookId as string))
    } catch (err) {
      error.value = 'Kitap bilgileri yüklenirken bir hata oluştu.'
    }
  }
  isLoading.value = false
})

const handleSubmit = async (bookData: Book) => {
  try {
    if (route.params.id) {
      await store.dispatch('books/updateBook', {
        id: parseInt(route.params.id as string),
        ...bookData
      })
      router.push('/books')
    } else {
      await store.dispatch('books/addBook', bookData)
      router.push('/books')
    }
  } catch (err) {
    error.value = 'Kitap kaydedilirken bir hata oluştu.'
  }
}
</script>

<template>
  <div class="book-manage">
    <h1>{{ route.params.id ? 'Kitap Düzenle' : 'Yeni Kitap Ekle' }}</h1>

    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Yükleniyor...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else>
      <BookForm
        :initial-book="book"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/styles/_variables.scss' as *;

.book-manage {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-6;

  h1 {
    margin-bottom: $spacing-6;
    color: var(--color-heading);
    font-size: $font-size-2xl;
    text-align: center;
  }
}

.loading,
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--color-text-light);
  font-size: $font-size-lg;

  i {
    margin-right: $spacing-2;
    color: var(--color-primary);
  }
}

.error {
  color: var(--color-error);
}

@media (max-width: 768px) {
  .book-manage {
    padding: $spacing-4;

    h1 {
      font-size: $font-size-xl;
      margin-bottom: $spacing-4;
    }
  }
}
</style> 