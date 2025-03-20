<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import type { Book } from '@/types/book'
import BookReview from '@/components/books/BookReview.vue'
import Comments from '@/components/books/Comments.vue'
import RelatedBooks from '@/components/books/RelatedBooks.vue'
import ShareButtons from '@/components/common/ShareButtons.vue'

const route = useRoute()
const store = useStore()
const book = ref<Book | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

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
              <i v-for="n in 5" :key="n" class="fas" :class="n <= book.rating ? 'fa-star' : 'fa-star-o'"></i>
              <span>{{ book.rating }}/5</span>
            </div>
            <p class="price">{{ book.price.toFixed(2) }} TL</p>
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

.book-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-6;
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

        .price {
          font-size: $font-size-xl;
          font-weight: $font-weight-bold;
          color: var(--color-primary);
          margin-bottom: $spacing-4;
        }

        .add-to-cart {
          padding: $spacing-3 $spacing-6;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: $border-radius;
          font-weight: $font-weight-medium;
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover {
            background: var(--color-primary-dark);
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