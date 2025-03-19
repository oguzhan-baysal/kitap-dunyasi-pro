<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { State } from '@/types/store';
import type { Book } from '@/types/books';
import type { Comment } from '@/types/comments';

const store = useStore<State>();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const error = ref('');
const commentLoading = ref(false);
const commentError = ref('');

const bookId = computed(() => route.params.id as string);
const book = computed(() => store.getters['books/bookById'](bookId.value));
const comments = computed(() => store.getters['comments/commentsByBookId'](bookId.value));
const relatedBooks = computed(() => 
  store.getters['books/relatedBooks'](bookId.value, book.value?.category)
);
const isInFavorites = computed(() => 
  store.getters['favorites/isFavorite'](bookId.value)
);
const averageRating = computed(() => 
  store.getters['comments/averageRating'](bookId.value)
);
const user = computed(() => store.state.user.currentUser);

// Comment form
const commentText = ref('');
const rating = ref(5);
const showCommentForm = computed(() => !!user.value);

const fetchData = async () => {
  loading.value = true;
  error.value = '';

  try {
    await Promise.all([
      store.dispatch('books/fetchBookDetails', bookId.value),
      store.dispatch('comments/fetchComments', bookId.value)
    ]);

    if (!book.value) {
      router.push('/404');
      return;
    }
  } catch (err) {
    error.value = 'Kitap detayları yüklenirken bir hata oluştu';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const toggleFavorite = async () => {
  if (!user.value) {
    router.push('/auth/login');
    return;
  }

  try {
    if (isInFavorites.value) {
      await store.dispatch('favorites/removeFromFavorites', bookId.value);
    } else {
      await store.dispatch('favorites/addToFavorite', bookId.value);
    }
  } catch (err) {
    console.error('Favorilere eklenirken bir hata oluştu:', err);
  }
};

const handleCommentSubmit = async () => {
  if (!user.value || commentLoading.value) return;

  commentLoading.value = true;
  commentError.value = '';

  try {
    await store.dispatch('comments/addComment', {
      bookId: bookId.value,
      content: commentText.value,
      rating: rating.value
    });

    commentText.value = '';
    rating.value = 5;
  } catch (err) {
    commentError.value = 'Yorum eklenirken bir hata oluştu';
    console.error(err);
  } finally {
    commentLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <main class="book-details-page">
    <div v-if="loading" class="loading-container">
      <span class="loader"></span>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <template v-else-if="book">
      <section class="book-header">
        <div class="book-image">
          <img :src="book.coverImage" :alt="book.title">
        </div>

        <div class="book-info">
          <h1>{{ book.title }}</h1>
          <p class="author">{{ book.author }}</p>
          
          <div class="meta-info">
            <span class="category">{{ book.category }}</span>
            <span class="rating" v-if="averageRating > 0">
              {{ averageRating.toFixed(1) }} / 5
              ({{ comments.length }} değerlendirme)
            </span>
          </div>

          <p class="description">{{ book.description }}</p>

          <div class="price-section">
            <p class="price">{{ book.price }} TL</p>
            <button
              class="favorite-button"
              :class="{ active: isInFavorites }"
              @click="toggleFavorite"
            >
              {{ isInFavorites ? 'Favorilerden Çıkar' : 'Favorilere Ekle' }}
            </button>
          </div>

          <div class="details">
            <div class="detail-item">
              <span class="label">Yayınevi:</span>
              <span>{{ book.publisher }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Sayfa Sayısı:</span>
              <span>{{ book.pageCount }}</span>
            </div>
            <div class="detail-item">
              <span class="label">ISBN:</span>
              <span>{{ book.isbn }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Yayın Tarihi:</span>
              <span>{{ new Date(book.publishDate).toLocaleDateString('tr-TR') }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="comments-section">
        <h2>Yorumlar ve Değerlendirmeler</h2>

        <div v-if="showCommentForm" class="comment-form">
          <div class="rating-input">
            <label>Puanınız:</label>
            <div class="rating-stars">
              <button
                v-for="star in 5"
                :key="star"
                :class="{ active: star <= rating }"
                @click="rating = star"
              >
                ★
              </button>
            </div>
          </div>

          <textarea
            v-model="commentText"
            placeholder="Yorumunuzu yazın..."
            :disabled="commentLoading"
          ></textarea>

          <div v-if="commentError" class="error-message">
            {{ commentError }}
          </div>

          <button
            class="submit-comment"
            :disabled="!commentText.trim() || commentLoading"
            @click="handleCommentSubmit"
          >
            <span v-if="!commentLoading">Yorum Ekle</span>
            <span v-else class="loader"></span>
          </button>
        </div>

        <div v-else class="login-prompt">
          <p>Yorum yapmak için lütfen <router-link to="/auth/login">giriş yapın</router-link>.</p>
        </div>

        <div class="comments-list">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="comment-card"
          >
            <div class="comment-header">
              <span class="user-name">{{ comment.userName }}</span>
              <div class="rating-display">
                <span v-for="star in 5" :key="star" :class="{ filled: star <= comment.rating }">
                  ★
                </span>
              </div>
              <span class="comment-date">
                {{ new Date(comment.createdAt).toLocaleDateString('tr-TR') }}
              </span>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
          </div>

          <div v-if="comments.length === 0" class="no-comments">
            <p>Bu kitap için henüz yorum yapılmamış.</p>
          </div>
        </div>
      </section>

      <section v-if="relatedBooks.length > 0" class="related-books">
        <h2>Benzer Kitaplar</h2>
        
        <div class="related-books-grid">
          <div
            v-for="relatedBook in relatedBooks"
            :key="relatedBook.id"
            class="book-card"
          >
            <router-link :to="`/books/${relatedBook.id}`">
              <img :src="relatedBook.coverImage" :alt="relatedBook.title">
              <div class="book-info">
                <h3>{{ relatedBook.title }}</h3>
                <p class="author">{{ relatedBook.author }}</p>
                <p class="price">{{ relatedBook.price }} TL</p>
              </div>
            </router-link>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>

<style lang="scss" scoped>
.book-details-page {
  padding: $spacing-4;
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: $spacing-8;

  .loader {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-color);
    border-radius: 50%;
    border-top-color: var(--primary);
    animation: spin 1s linear infinite;
  }
}

.error-message {
  padding: $spacing-4;
  background-color: rgba($error, 0.1);
  border: 1px solid var(--error);
  border-radius: $border-radius;
  color: var(--error);
  text-align: center;
  margin: $spacing-4 0;
}

.book-header {
  display: flex;
  gap: $spacing-8;
  background-color: var(--bg-primary);
  padding: $spacing-8;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  margin-bottom: $spacing-8;

  .book-image {
    flex-shrink: 0;
    width: 300px;

    img {
      width: 100%;
      height: auto;
      border-radius: $border-radius;
      box-shadow: $shadow-md;
    }
  }

  .book-info {
    flex-grow: 1;

    h1 {
      font-size: $font-size-4xl;
      color: var(--text-primary);
      margin-bottom: $spacing-2;
    }

    .author {
      font-size: $font-size-xl;
      color: var(--text-secondary);
      margin-bottom: $spacing-4;
    }

    .meta-info {
      display: flex;
      gap: $spacing-4;
      margin-bottom: $spacing-4;

      .category {
        padding: $spacing-1 $spacing-3;
        background-color: var(--bg-secondary);
        border-radius: $border-radius;
        color: var(--text-secondary);
      }

      .rating {
        color: var(--primary);
      }
    }

    .description {
      color: var(--text-primary);
      line-height: 1.6;
      margin-bottom: $spacing-6;
    }

    .price-section {
      display: flex;
      align-items: center;
      gap: $spacing-4;
      margin-bottom: $spacing-6;

      .price {
        font-size: $font-size-2xl;
        color: var(--primary);
        font-weight: $font-weight-bold;
      }

      .favorite-button {
        padding: $spacing-2 $spacing-4;
        background-color: transparent;
        border: 2px solid var(--primary);
        border-radius: $border-radius;
        color: var(--primary);
        font-weight: $font-weight-medium;
        cursor: pointer;
        transition: $transition-base;

        &:hover {
          background-color: var(--primary);
          color: white;
        }

        &.active {
          background-color: var(--primary);
          color: white;
        }
      }
    }

    .details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-4;

      .detail-item {
        color: var(--text-primary);

        .label {
          color: var(--text-secondary);
          margin-right: $spacing-2;
        }
      }
    }
  }
}

.comments-section {
  background-color: var(--bg-primary);
  padding: $spacing-8;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  margin-bottom: $spacing-8;

  h2 {
    font-size: $font-size-2xl;
    color: var(--text-primary);
    margin-bottom: $spacing-6;
  }
}

.comment-form {
  margin-bottom: $spacing-8;

  .rating-input {
    display: flex;
    align-items: center;
    gap: $spacing-4;
    margin-bottom: $spacing-4;

    label {
      color: var(--text-primary);
    }

    .rating-stars {
      display: flex;
      gap: $spacing-1;

      button {
        background: none;
        border: none;
        font-size: $font-size-xl;
        color: var(--border-color);
        cursor: pointer;
        transition: $transition-base;

        &.active {
          color: var(--primary);
        }
      }
    }
  }

  textarea {
    width: 100%;
    height: 120px;
    padding: $spacing-3;
    border: 1px solid var(--border-color);
    border-radius: $border-radius;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    margin-bottom: $spacing-4;
    resize: vertical;

    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba($primary, 0.1);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .submit-comment {
    padding: $spacing-3 $spacing-6;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: $border-radius;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: $transition-base;

    &:hover:not(:disabled) {
      background-color: var(--primary-dark);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loader {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
      display: inline-block;
    }
  }
}

.login-prompt {
  text-align: center;
  padding: $spacing-4;
  background-color: var(--bg-secondary);
  border-radius: $border-radius;
  margin-bottom: $spacing-8;

  a {
    color: var(--primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.comments-list {
  .comment-card {
    padding: $spacing-4;
    border: 1px solid var(--border-color);
    border-radius: $border-radius;
    margin-bottom: $spacing-4;

    &:last-child {
      margin-bottom: 0;
    }

    .comment-header {
      display: flex;
      align-items: center;
      gap: $spacing-4;
      margin-bottom: $spacing-2;

      .user-name {
        font-weight: $font-weight-medium;
        color: var(--text-primary);
      }

      .rating-display {
        color: var(--border-color);

        span {
          &.filled {
            color: var(--primary);
          }
        }
      }

      .comment-date {
        color: var(--text-secondary);
        font-size: $font-size-sm;
      }
    }

    .comment-content {
      color: var(--text-primary);
      line-height: 1.6;
    }
  }
}

.no-comments {
  text-align: center;
  color: var(--text-secondary);
  padding: $spacing-4;
}

.related-books {
  h2 {
    font-size: $font-size-2xl;
    color: var(--text-primary);
    margin-bottom: $spacing-6;
  }
}

.related-books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-6;
}

.book-card {
  background-color: var(--bg-primary);
  border-radius: $border-radius-lg;
  overflow: hidden;
  transition: $transition-base;
  box-shadow: $shadow-md;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  img {
    width: 100%;
    height: 280px;
    object-fit: cover;
  }

  .book-info {
    padding: $spacing-4;

    h3 {
      font-size: $font-size-lg;
      color: var(--text-primary);
      margin-bottom: $spacing-2;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .author {
      color: var(--text-secondary);
      margin-bottom: $spacing-2;
      font-size: $font-size-sm;
    }

    .price {
      color: var(--primary);
      font-weight: $font-weight-bold;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: $breakpoint-lg) {
  .book-header {
    flex-direction: column;

    .book-image {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .book-info {
    .details {
      grid-template-columns: 1fr;
    }
  }

  .related-books-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  .book-card img {
    height: 220px;
  }
}

@media (max-width: $breakpoint-sm) {
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-2;
  }
}
</style> 