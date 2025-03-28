<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import type { Book } from '@/types/book'
import BookReview from '@/components/books/BookReview.vue'
import Comments from '@/components/books/Comments.vue'
import RelatedBooks from '@/components/books/RelatedBooks.vue'
import ShareButtons from '@/components/common/ShareButtons.vue'
import CurrencySelector from '@/components/ui/CurrencySelector.vue'

const route = useRoute()
const store = useStore()
const book = ref<Book | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const rating = ref(5)

const formattedPrice = computed(() => {
  if (!book.value) return ''
  
  const selectedCurrency = store.getters['currency/getSelectedCurrency']
  const rate = store.getters['currency/getRate'](selectedCurrency)
  const price = book.value.price * rate

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: selectedCurrency
  }).format(price)
})

onMounted(async () => {
  try {
    const bookId = parseInt(route.params.id as string)
    await store.dispatch('books/fetchBookDetails', bookId)
    book.value = store.getters['books/getBookById'](bookId)
    isLoading.value = false
  } catch (err) {
    error.value = 'Kitap detayları yüklenirken bir hata oluştu.'
    isLoading.value = false
  }
})
</script>

<template>
  <div class="book-detail">
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Yükleniyor...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="book" class="book-content">
      <div class="book-header">
        <div class="book-info">
          <img :src="book.coverImage" :alt="book.title" class="cover-image">
          <div class="details">
            <h1>{{ book.title }}</h1>
            <p class="author">{{ book.author }}</p>
            <div class="rating">
              <label>Puanınız:</label>
              <select v-model="rating" class="rating-select">
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
              <div class="stars">
                <svg v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= rating, 'empty': n > rating }" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
            </div>
            <div class="price-container">
              <p class="price">{{ formattedPrice }}</p>
              <CurrencySelector class="currency-selector" />
            </div>
            <button class="add-to-cart">Sepete Ekle</button>
          </div>
        </div>
        <ShareButtons :book="book" />
      </div>

      <div class="book-description">
        <h2>Kitap Hakkında</h2>
        <p>{{ book.description }}</p>
      </div>

      <div class="book-sections">
        <BookReview :book="book" />
        <Comments :book="book" />
        <RelatedBooks :currentBook="book" />
      </div>
    </div>

    <div v-else class="not-found">
      Kitap bulunamadı.
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/styles/_variables.scss' as *;

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  label {
    font-size: 0.9rem;
    color: var(--color-text);
  }

  select {
    width: 45px;
    padding: 0.25rem;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    font-size: 0.9rem;
    appearance: none;
    text-align: center;
    cursor: pointer;
    color: #000000 !important;
  }

  .stars {
    display: flex;
    gap: 0.25rem;
    
    .star {
      fill: #e5e7eb;
      transition: fill 0.2s ease;
      
      &.filled {
        fill: #ffd700;
      }
    }
  }
}

[data-theme="dark"] {
  .book-detail {
    background: #1a1a1a;
    color: #ffffff;
    padding: 2rem;
    border-radius: 8px;
    
    .book-title,
    .book-author,
    .book-description,
    .book-meta,
    .review-section,
    .review-item,
    .review-author,
    .review-text,
    .share-section,
    .rating-section,
    .rating-label,
    label,
    p {
      color: #e2e8f0 !important;
    }

    .review-form {
      background: #1a1a1a;
      
      textarea,
      input {
        background: #1a1a1a;
        color: #ffffff;
        border: 1px solid #333333;
      }
    }

    .reviews-list {
      .review {
        background: #1a1a1a;
        border: 1px solid #333333;
      }
    }

    .rating-section {
      background: #1a1a1a;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #333333;

      label, select {
        color: #ffffff;
      }
    }

    .rating {
      label {
        color: #ffffff !important;
      }
    }
  }

  .rating {
    label {
      color: #ffffff !important;
    }
    select {
      background: #ffffff;
      border-color: #333333;
      color: #000000;
    }
  }
}

.book-detail {
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
}

.loading,
.error,
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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

.book-content {
  .book-header {
    margin-bottom: $spacing-8;

    .book-info {
      display: flex;
      gap: $spacing-6;
      margin-bottom: $spacing-6;

      .cover-image {
        width: 300px;
        height: auto;
        border-radius: $border-radius;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .details {
        flex: 1;

        h1 {
          font-size: $font-size-2xl;
          color: var(--color-heading);
          margin-bottom: $spacing-4;
        }

        .author {
          font-size: $font-size-lg;
          color: var(--color-text-light);
          margin-bottom: $spacing-4;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: $spacing-2;
          margin-bottom: $spacing-4;
          color: #ffd700;

          span {
            color: var(--color-text);
            margin-left: $spacing-2;
          }
        }

        .price-container {
          display: flex;
          align-items: center;
          gap: $spacing-4;
          margin-bottom: $spacing-4;

          .price {
            font-size: $font-size-xl;
            font-weight: $font-weight-bold;
            color: var(--color-primary);
            margin: 0;
          }

          .currency-selector {
            min-width: 70px;
          }
        }

        .add-to-cart {
          display: inline-flex;
          align-items: center;
          gap: $spacing-2;
          padding: $spacing-3 $spacing-6;
          background: var(--color-primary) !important;
          color: white !important;
          font-weight: $font-weight-medium;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          outline: none;
          border: none;
          border-radius: $border-radius;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              120deg,
              transparent,
              rgba(255, 255, 255, 0.3),
              transparent
            );
            transition: 0.5s ease;
            pointer-events: none;
          }

          &:hover, &:focus, &:active {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            background: var(--color-primary) !important;

            &::before {
              left: 100%;
            }
          }

          &:focus {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
          }
        }
      }
    }
  }

  .book-description {
    background: var(--color-background-soft);
    padding: $spacing-6;
    border-radius: $border-radius;
    margin-bottom: $spacing-8;

    h2 {
      color: var(--color-heading);
      margin-bottom: $spacing-4;
    }

    p {
      color: var(--color-text);
      line-height: 1.6;
    }
  }

  .book-sections {
    display: grid;
    gap: $spacing-6;
  }
}

@media (max-width: 768px) {
  .book-detail {
    padding: $spacing-4;
  }

  .book-content {
    .book-header {
      .book-info {
        flex-direction: column;

        .cover-image {
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
        }
      }
    }

    .book-description,
    .book-sections > * {
      padding: $spacing-4;
    }
  }
}
</style> 