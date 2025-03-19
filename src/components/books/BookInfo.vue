<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { Book } from '@/types'

const props = defineProps<{
  book: Book
}>()

const store = useStore()

const formattedPrice = computed(() => {
  return store.dispatch('currency/formatPrice', props.book.price)
})
</script>

<template>
  <div class="book-info">
    <div class="book-info__header">
      <img :src="book.coverImage" :alt="book.title" class="book-info__image">
      <div class="book-info__main">
        <h1 class="book-info__title">{{ book.title }}</h1>
        <p class="book-info__author">{{ book.author }}</p>
        <p class="book-info__price">{{ formattedPrice }}</p>
        <div class="book-info__meta">
          <div class="meta-item">
            <span class="label">Yayınevi:</span>
            <span>{{ book.publisher }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Sayfa Sayısı:</span>
            <span>{{ book.pageCount }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Yayın Yılı:</span>
            <span>{{ book.publishYear }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Dil:</span>
            <span>{{ book.language }}</span>
          </div>
          <div class="meta-item">
            <span class="label">ISBN:</span>
            <span>{{ book.isbn }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="book-info__description">
      <h2>Kitap Açıklaması</h2>
      <p>{{ book.description }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.book-info {
  background: var(--color-card-bg);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &__header {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__image {
    width: 100%;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__title {
    font-size: 2rem;
    margin: 0;
    color: var(--color-text-primary);
  }

  &__author {
    font-size: 1.2rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  &__price {
    font-size: 1.5rem;
    color: var(--color-primary);
    font-weight: bold;
    margin: 0;
  }

  &__meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;

    .meta-item {
      display: flex;
      gap: 0.5rem;

      .label {
        color: var(--color-text-secondary);
        font-weight: 500;
      }
    }
  }

  &__description {
    h2 {
      font-size: 1.5rem;
      margin: 0 0 1rem;
      color: var(--color-text-primary);
    }

    p {
      line-height: 1.6;
      color: var(--color-text-secondary);
      margin: 0;
    }
  }
}
</style> 