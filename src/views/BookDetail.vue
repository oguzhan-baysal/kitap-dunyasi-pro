<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import BookInfo from '@/components/books/BookInfo.vue'
import BookReviews from '@/components/books/BookReviews.vue'
import RelatedBooks from '@/components/books/RelatedBooks.vue'

const store = useStore()
const route = useRoute()

const bookId = route.params.id as string
const book = computed(() => store.getters['books/getBookById'](bookId))
const isLoading = computed(() => store.state.books.loading)

onMounted(() => {
  store.dispatch('books/fetchBook', bookId)
})
</script>

<template>
  <div class="book-detail-view">
    <div v-if="isLoading" class="loading">
      Yükleniyor...
    </div>
    
    <div v-else-if="!book" class="not-found">
      <p>Kitap bulunamadı</p>
      <router-link to="/books" class="back-link">
        Kitaplara Dön
      </router-link>
    </div>
    
    <template v-else>
      <BookInfo :book="book" />
      <BookReviews :book-id="bookId" />
      <RelatedBooks :category="book.category" :exclude-id="bookId" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.book-detail-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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