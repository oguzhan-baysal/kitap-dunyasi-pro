<script setup lang="ts">
import { useBook } from '@/composables/useBook'
import type { Book } from '@/types'

const props = defineProps<{
  book: Book
}>()

const {
  formattedPrice,
  formattedRating,
  formattedPublishDate,
  stockCode,
  isAvailable,
  toggleFavorite
} = useBook(props.book)
</script>

<template>
  <div class="book-info">
    <div class="book-info__header">
      <img :src="book.coverImage" :alt="book.title" class="book-info__image">
      <div class="book-info__main">
        <h1 class="book-info__title">{{ book.title }}</h1>
        <p class="book-info__author">{{ book.author }}</p>
        <div class="book-info__rating">
          <span class="stars">
            <i v-for="i in 5" :key="i" 
               class="fas fa-star" 
               :class="{ 'filled': i <= book.rating }">
            </i>
          </span>
          <span class="rating-text">{{ formattedRating }}</span>
        </div>
        <p class="book-info__price">{{ formattedPrice }}</p>
        <button class="book-info__cart-btn">
          <i class="fas fa-shopping-cart"></i>
          Sepete Ekle
        </button>
        <button class="book-info__favorite-btn" @click="toggleFavorite">
          <i class="fas" :class="book.isFavorite ? 'fa-heart' : 'fa-heart-o'"></i>
          {{ book.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle' }}
        </button>
      </div>
    </div>
    
    <div class="book-info__description">
      <h2>Kitap Hakkında</h2>
      <p>{{ book.description }}</p>
      
      <div class="book-info__meta-details">
        <h3>Detaylı Bilgiler</h3>
        <div class="meta-grid">
          <div class="meta-item">
            <span class="label">ISBN:</span>
            <span>{{ book.isbn || '978-XXX-XX-XXXXX-X' }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Dil:</span>
            <span>{{ book.language }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Sayfa Sayısı:</span>
            <span>{{ book.pageCount }} sayfa</span>
          </div>
          <div class="meta-item">
            <span class="label">Basım Tarihi:</span>
            <span>{{ formattedPublishDate }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Kategori:</span>
            <span>{{ book.category }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Yayınevi:</span>
            <span>{{ book.publisher || 'Belirtilmemiş' }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Stok Kodu:</span>
            <span>{{ stockCode }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Durum:</span>
            <span>{{ isAvailable }}</span>
          </div>
        </div>
      </div>
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

  &__rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__stars {
    display: flex;
    gap: 0.2rem;
  }

  &__rating-text {
    font-size: 1.2rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  &__cart-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    max-width: fit-content;

    &:hover {
      background: var(--color-bg-hover);
      border-color: var(--color-primary);
    }

    i {
      color: var(--color-primary);
      font-size: 1.1rem;
    }
  }

  &__favorite-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    max-width: fit-content;

    &:hover {
      background: var(--color-bg-hover);
      border-color: var(--color-primary);
    }

    i {
      color: var(--color-primary);
      font-size: 1.1rem;
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

  &__meta-details {
    h3 {
      font-size: 1.5rem;
      margin: 0 0 1rem;
      color: var(--color-text-primary);
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .meta-item {
      display: flex;
      gap: 0.5rem;

      .label {
        color: var(--color-text-secondary);
        font-weight: 500;
      }
    }
  }
}
</style> 