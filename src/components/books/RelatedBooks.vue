<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Book } from '@/types/book'
import BookCard from './BookCard.vue'

const props = defineProps<{
  currentBook: Book
}>()

const relatedBooks = ref<Book[]>([
  {
    id: 3,
    title: 'Suç ve Ceza',
    author: 'Fyodor Dostoyevski',
    description: 'Rus edebiyatının en önemli eserlerinden biri.',
    price: 89.90,
    rating: 4.8,
    coverImage: '/images/suc-ve-ceza.jpg'
  },
  {
    id: 4,
    title: 'Sefiller',
    author: 'Victor Hugo',
    description: 'Fransız edebiyatının başyapıtlarından.',
    price: 99.90,
    rating: 4.7,
    coverImage: '/images/sefiller.jpg'
  }
])

const isLoading = ref(true)

onMounted(async () => {
  try {
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 1000))
    isLoading.value = false
  } catch (error) {
    console.error('İlgili kitaplar yüklenirken hata:', error)
  }
})
</script>

<template>
  <div class="related-books">
    <h2>Benzer Kitaplar</h2>
    
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Yükleniyor...
    </div>
    
    <div v-else class="books-grid">
      <BookCard
        v-for="book in relatedBooks"
        :key="book.id"
        :book="book"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.related-books {
  background: var(--color-background-soft);
  padding: $spacing-6;
  border-radius: $border-radius;

  h2 {
    margin-bottom: $spacing-6;
    color: var(--color-heading);
  }
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-2;
  color: var(--color-text-light);
  padding: $spacing-6;
  font-size: $font-size-lg;

  i {
    color: var(--color-primary);
  }
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-4;
}

@media (max-width: 768px) {
  .related-books {
    padding: $spacing-4;
  }

  .books-grid {
    grid-template-columns: 1fr;
  }
}
</style> 