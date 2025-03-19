<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import BookForm from '@/components/books/BookForm.vue'

const store = useStore()
const route = useRoute()

const bookId = route.params.id as string
const book = computed(() => store.getters['books/getBookById'](bookId))
const isLoading = computed(() => store.state.books.loading)
</script>

<template>
  <div class="book-edit-view">
    <h1>Kitap Düzenle</h1>
    
    <div v-if="isLoading" class="loading">
      Yükleniyor...
    </div>
    
    <div v-else-if="!book" class="not-found">
      <p>Kitap bulunamadı</p>
      <router-link to="/books" class="back-link">
        Kitaplara Dön
      </router-link>
    </div>
    
    <BookForm
      v-else
      :initial-data="book"
      mode="edit"
    />
  </div>
</template>

<style lang="scss" scoped>
.book-edit-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    margin: 0 0 2rem;
    font-size: 2rem;
  }
}

.loading {
  text-align: center;
  padding: 4rem;
  color: var(--color-text-light);
}

.not-found {
  text-align: center;
  padding: 4rem;
  
  p {
    color: var(--color-text-light);
    margin-bottom: 1rem;
  }
}

.back-link {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
  
  &:hover {
    background: var(--color-primary-dark);
  }
}
</style> 