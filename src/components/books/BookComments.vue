<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/store'
import type { Book } from '@/types/book'

const props = defineProps<{
  book: Book
}>()

const store = useStore()
const comments = computed(() => store.getters['comments/getBookComments'](props.book.id))
const loading = computed(() => store.getters['comments/isLoading'])
const error = computed(() => store.getters['comments/getError'])

const newComment = ref({
  content: '',
  rating: 5
})

onMounted(async () => {
  await store.dispatch('comments/fetchBookComments', props.book.id)
})

const submitComment = async () => {
  if (!newComment.value.content) return

  try {
    await store.dispatch('comments/addComment', {
      bookId: props.book.id,
      userId: 1, // Simüle edilmiş kullanıcı ID'si
      username: 'Misafir Kullanıcı',
      content: newComment.value.content,
      rating: newComment.value.rating
    })

    // Formu temizle
    newComment.value.content = ''
    newComment.value.rating = 5
  } catch (error) {
    console.error('Yorum gönderilirken hata:', error)
  }
}
</script>

<template>
  <div class="book-comments">
    <h2>Yorumlar</h2>

    <div v-if="loading" class="loading">
      Yorumlar yükleniyor...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else>
      <div class="comments-list">
        <div v-if="comments.length === 0" class="no-comments">
          Henüz yorum yapılmamış.
        </div>

        <div v-else v-for="comment in comments" :key="comment.id" class="comment">
          <div class="comment-header">
            <span class="username">{{ comment.username }}</span>
            <div class="rating">
              <span v-for="n in 5" :key="n" class="star">
                ★
              </span>
              <span class="rating-value">({{ comment.rating }})</span>
            </div>
            <span class="date">{{ new Date(comment.createdAt).toLocaleDateString('tr-TR') }}</span>
          </div>
          <p class="content">{{ comment.content }}</p>
        </div>
      </div>

      <form @submit.prevent="submitComment" class="comment-form">
        <div class="form-group">
          <label for="rating">Puanınız:</label>
          <select v-model="newComment.rating" id="rating">
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="content">Yorumunuz:</label>
          <textarea
            v-model="newComment.content"
            id="content"
            rows="4"
            placeholder="Bu kitap hakkında ne düşünüyorsunuz?"
          ></textarea>
        </div>

        <button type="submit" :disabled="!newComment.content">
          Yorum Yap
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.book-comments {
  background: var(--color-background-soft);
  padding: $spacing-6;
  border-radius: $border-radius;

  h2 {
    margin-bottom: $spacing-6;
    color: var(--color-heading);
  }
}

.loading,
.error,
.no-comments {
  text-align: center;
  padding: $spacing-4;
  color: var(--color-text-light);
}

.error {
  color: var(--color-error);
}

.comments-list {
  margin-bottom: $spacing-6;

  .comment {
    background: var(--color-background);
    padding: $spacing-4;
    border-radius: $border-radius;
    margin-bottom: $spacing-4;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .comment-header {
      display: flex;
      align-items: center;
      gap: $spacing-4;
      margin-bottom: $spacing-2;

      .username {
        font-weight: $font-weight-medium;
        color: var(--color-heading);
      }

      .rating {
        display: flex;
        align-items: center;
        gap: $spacing-1;

        .star {
          color: #ffd700;
        }

        .rating-value {
          color: var(--color-text-light);
        }
      }

      .date {
        color: var(--color-text-light);
        font-size: $font-size-sm;
        margin-left: auto;
      }
    }

    .content {
      color: var(--color-text);
      line-height: 1.6;
    }
  }
}

.comment-form {
  background: var(--color-background);
  padding: $spacing-4;
  border-radius: $border-radius;

  .form-group {
    margin-bottom: $spacing-4;

    label {
      display: block;
      margin-bottom: $spacing-2;
      color: var(--color-text);
      font-weight: $font-weight-medium;
    }

    select,
    textarea {
      width: 100%;
      padding: $spacing-2;
      border: 1px solid var(--color-border);
      border-radius: $border-radius;
      background: var(--color-background);
      color: var(--color-text);
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }
  }

  button {
    width: 100%;
    padding: $spacing-3;
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

    &:disabled {
      background: var(--color-border);
      cursor: not-allowed;
    }
  }
}

@media (max-width: 768px) {
  .book-comments {
    padding: $spacing-4;
  }

  .comment-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: $spacing-2 !important;

    .date {
      margin-left: 0 !important;
    }
  }
}
</style> 