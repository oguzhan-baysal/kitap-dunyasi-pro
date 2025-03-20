<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'
import type { Book } from '@/types/book'

const props = defineProps<{
  book: Book
}>()

const store = useStore()

const isFavorite = computed(() => 
  store.getters['favorites/isFavorite'](props.book.id)
)

const toggleFavorite = () => {
  if (isFavorite.value) {
    store.dispatch('favorites/removeFromFavorites', props.book.id)
  } else {
    store.dispatch('favorites/addToFavorites', props.book)
  }
}

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(props.book.price)
})
</script>

<template>
  <div class="book-list-item">
    <div class="book-image">
      <img :src="book.coverImage" :alt="book.title">
    </div>

    <div class="book-info">
      <h3 class="book-title">
        <router-link :to="'/books/' + book.id">
          {{ book.title }}
        </router-link>
      </h3>
      
      <p class="book-author">{{ book.author }}</p>
      
      <p class="book-description">{{ book.description }}</p>
      
      <div class="book-meta">
        <span class="book-price">{{ formattedPrice }}</span>
        <span class="book-rating">
          <i class="fas fa-star"></i>
          {{ book.rating }}
        </span>
      </div>
    </div>

    <div class="book-actions">
      <button 
        class="favorite-button"
        :class="{ active: isFavorite }"
        @click="toggleFavorite"
      >
        <i class="fas fa-heart"></i>
      </button>

      <router-link 
        :to="'/books/' + book.id"
        class="details-button"
      >
        Detaylar
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.book-list-item {
  display: flex;
  gap: $spacing-6;
  padding: $spacing-4;
  background: var(--color-background);
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  transition: all 0.2s;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  .book-image {
    flex-shrink: 0;
    width: 120px;

    img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: $border-radius;
    }
  }

  .book-info {
    flex: 1;
    min-width: 0;

    .book-title {
      font-size: $font-size-xl;
      margin: 0 0 $spacing-2;

      a {
        color: var(--color-heading);
        text-decoration: none;

        &:hover {
          color: var(--color-primary);
        }
      }
    }

    .book-author {
      color: var(--color-text-light);
      margin: 0 0 $spacing-3;
      font-size: $font-size-base;
    }

    .book-description {
      color: var(--color-text);
      margin: 0 0 $spacing-4;
      font-size: $font-size-base;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .book-meta {
      display: flex;
      align-items: center;
      gap: $spacing-4;
      font-size: $font-size-base;

      .book-price {
        font-weight: $font-weight-semibold;
        color: var(--color-primary);
      }

      .book-rating {
        display: flex;
        align-items: center;
        gap: $spacing-1;
        color: var(--color-text-light);

        i {
          color: #ffd700;
        }
      }
    }
  }

  .book-actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
    justify-content: center;

    .favorite-button {
      background: none;
      border: none;
      color: var(--color-text-light);
      font-size: $font-size-xl;
      cursor: pointer;
      padding: $spacing-2;
      border-radius: $border-radius;
      transition: all 0.2s;

      &:hover {
        color: #ff4081;
        background: var(--color-background-soft);
      }

      &.active {
        color: #ff4081;
      }
    }

    .details-button {
      display: inline-block;
      padding: $spacing-2 $spacing-4;
      background-color: var(--color-primary);
      color: white;
      text-decoration: none;
      border-radius: $border-radius;
      font-size: $font-size-sm;
      text-align: center;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--color-primary-dark);
      }
    }
  }
}

@media (max-width: 640px) {
  .book-list-item {
    flex-direction: column;
    gap: $spacing-4;

    .book-image {
      width: 100%;
      
      img {
        width: 100%;
        height: 200px;
      }
    }

    .book-actions {
      flex-direction: row;
      justify-content: space-between;
      
      .details-button {
        flex: 1;
      }
    }
  }
}
</style> 