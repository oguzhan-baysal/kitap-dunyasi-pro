<script setup lang="ts">
import { ref } from 'vue'
import type { Book } from '@/types/book'

const props = defineProps<{
  book: Book
}>()

interface Comment {
  id: number
  user: string
  content: string
  date: string
}

const comments = ref<Comment[]>([
  {
    id: 1,
    user: 'Ahmet Y.',
    content: 'Harika bir kitap! Kesinlikle tavsiye ederim.',
    date: '2024-03-15'
  },
  {
    id: 2,
    user: 'Ayşe K.',
    content: 'Yazarın en iyi eserlerinden biri.',
    date: '2024-03-14'
  }
])

const newComment = ref('')
const isSubmitting = ref(false)

const submitComment = async () => {
  if (!newComment.value.trim()) return

  try {
    isSubmitting.value = true
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const comment: Comment = {
      id: comments.value.length + 1,
      user: 'Kullanıcı',
      content: newComment.value,
      date: new Date().toISOString().split('T')[0]
    }
    
    comments.value.unshift(comment)
    newComment.value = ''
  } catch (error) {
    console.error('Yorum gönderilirken hata:', error)
    alert('Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="comments">
    <h2>Yorumlar</h2>
    
    <form @submit.prevent="submitComment" class="comment-form">
      <textarea
        v-model="newComment"
        placeholder="Yorumunuzu yazın..."
        :disabled="isSubmitting"
      ></textarea>
      <button 
        type="submit"
        :disabled="isSubmitting || !newComment.trim()"
      >
        {{ isSubmitting ? 'Gönderiliyor...' : 'Yorum Yap' }}
      </button>
    </form>

    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <div class="comment-header">
          <span class="user">{{ comment.user }}</span>
          <span class="date">{{ comment.date }}</span>
        </div>
        <p class="content">{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.comments {
  background: var(--color-background-soft);
  padding: $spacing-6;
  border-radius: $border-radius;

  h2 {
    margin-bottom: $spacing-6;
    color: var(--color-heading);
  }
}

.comment-form {
  margin-bottom: $spacing-6;

  textarea {
    width: 100%;
    padding: $spacing-3;
    border: 1px solid var(--color-border);
    border-radius: $border-radius;
    background: var(--color-background);
    color: var(--color-text);
    font-family: inherit;
    resize: vertical;
    margin-bottom: $spacing-3;
    min-height: 100px;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
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

    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

.comments-list {
  .comment {
    padding: $spacing-4;
    border: 1px solid var(--color-border);
    border-radius: $border-radius;
    background: var(--color-background);
    margin-bottom: $spacing-3;

    &:last-child {
      margin-bottom: 0;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: $spacing-2;
      font-size: $font-size-sm;

      .user {
        font-weight: $font-weight-medium;
        color: var(--color-heading);
      }

      .date {
        color: var(--color-text-light);
      }
    }

    .content {
      color: var(--color-text);
      line-height: 1.5;
    }
  }
}

@media (max-width: 768px) {
  .comments {
    padding: $spacing-4;
  }
}
</style> 