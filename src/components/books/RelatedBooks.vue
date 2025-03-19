<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { Book } from '@/types'

const props = defineProps<{
  currentBook: Book
}>()

const store = useStore()

// Örnek veri - Gerçek uygulamada store'dan gelecek
const allBooks = [
  {
    id: '1',
    title: 'Suç ve Ceza',
    author: 'Fyodor Dostoyevski',
    price: 85.90,
    coverImage: '/images/suc-ve-ceza.jpg',
    category: 'Roman',
    language: 'Türkçe',
    pageCount: 687,
    publishYear: 1866,
    publisher: 'İş Bankası Kültür Yayınları',
    isbn: '9789754370669',
    description: 'Suç ve Ceza, insanlık durumlarının en ince ayrıntısına kadar işlendiği psikolojik bir romandır.'
  },
  {
    id: '2',
    title: 'Yeraltından Notlar',
    author: 'Fyodor Dostoyevski',
    price: 45.50,
    coverImage: '/images/yeralti.jpg',
    category: 'Roman',
    language: 'Türkçe',
    pageCount: 152,
    publishYear: 1864,
    publisher: 'İş Bankası Kültür Yayınları',
    isbn: '9789754370676',
    description: 'Yeraltından Notlar, modern insanın iç dünyasını anlatan öncü bir eserdir.'
  },
  {
    id: '3',
    title: 'Savaş ve Barış',
    author: 'Lev Tolstoy',
    price: 129.90,
    coverImage: '/images/savas-baris.jpg',
    category: 'Roman',
    language: 'Türkçe',
    pageCount: 1225,
    publishYear: 1867,
    publisher: 'İş Bankası Kültür Yayınları',
    isbn: '9789754370683',
    description: 'Savaş ve Barış, Napolyon Savaşları döneminde Rus toplumunu anlatan epik bir romandır.'
  }
]

const relatedBooks = computed(() => {
  return allBooks
    .filter(book => 
      book.id !== props.currentBook.id && 
      (book.category === props.currentBook.category || 
       book.author === props.currentBook.author)
    )
    .slice(0, 4)
})

const formatPrice = (price: number) => {
  return store.dispatch('currency/formatPrice', price)
}
</script>

<template>
  <div class="related-books">
    <h2 class="related-books__title">Benzer Kitaplar</h2>
    
    <div class="related-books__grid">
      <div v-for="book in relatedBooks" :key="book.id" class="book-card">
        <img :src="book.coverImage" :alt="book.title" class="book-card__image">
        <div class="book-card__content">
          <h3 class="book-card__title">{{ book.title }}</h3>
          <p class="book-card__author">{{ book.author }}</p>
          <p class="book-card__price">{{ formatPrice(book.price) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.related-books {
  margin-top: 2rem;

  &__title {
    font-size: 1.5rem;
    margin: 0 0 1.5rem;
    color: var(--color-text-primary);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
}

.book-card {
  background: var(--color-card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  &__image {
    width: 100%;
    height: 250px;
    object-fit: cover;
  }

  &__content {
    padding: 1rem;
  }

  &__title {
    font-size: 1rem;
    margin: 0 0 0.5rem;
    color: var(--color-text-primary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__author {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin: 0 0 0.5rem;
  }

  &__price {
    font-weight: bold;
    color: var(--color-primary);
    margin: 0;
  }
}
</style> 