<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface Comment {
  id: string
  bookId: string
  bookTitle: string
  bookCover: string
  rating: number
  content: string
  createdAt: string
}

const store = useStore()
const comments = ref<Comment[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

const currentPage = ref(1)
const itemsPerPage = 10
const totalItems = ref(0)

const sortOptions = [
  { value: 'date-desc', label: 'En Yeni Yorumlar' },
  { value: 'date-asc', label: 'En Eski Yorumlar' },
  { value: 'rating-desc', label: 'En Yüksek Puanlı' },
  { value: 'rating-asc', label: 'En Düşük Puanlı' }
]

const selectedSort = ref('date-desc')

const loadComments = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const response = await store.dispatch('comments/getUserComments', {
      page: currentPage.value,
      limit: itemsPerPage,
      sort: selectedSort.value
    })

    comments.value = response.comments
    totalItems.value = response.total

  } catch (error) {
    errorMessage.value = 'Yorumlar yüklenirken bir hata oluştu'
  } finally {
    isLoading.value = false
  }
}

const handleSort = (value: string) => {
  selectedSort.value = value
  currentPage.value = 1
  loadComments()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadComments()
}

const handleDeleteComment = async (commentId: string) => {
  if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return

  try {
    await store.dispatch('comments/deleteComment', commentId)
    await loadComments()
  } catch (error) {
    errorMessage.value = 'Yorum silinirken bir hata oluştu'
  }
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMMM yyyy')
}

const getRatingStars = (rating: number) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

onMounted(loadComments)
</script>

<template>
  <div class="user-comments">
    <div class="header">
      <h2>Yorumlarım</h2>
      
      <div class="actions">
        <select 
          v-model="selectedSort"
          class="sort-select"
          @change="handleSort((($event.target as HTMLSelectElement).value))"
        >
          <option 
            v-for="option in sortOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      Yorumlar yükleniyor...
    </div>

    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-else-if="comments.length === 0" class="empty-state">
      <p>Henüz yorum yapmamışsınız.</p>
      <router-link to="/" class="browse-button">
        Kitaplara Göz At
      </router-link>
    </div>

    <div v-else class="comments-list">
      <div 
        v-for="comment in comments"
        :key="comment.id"
        class="comment-card"
      >
        <router-link 
          :to="`/books/${comment.bookId}`"
          class="book-info"
        >
          <img 
            :src="comment.bookCover" 
            :alt="comment.bookTitle"
            class="book-cover"
          >
          <div class="book-details">
            <h3 class="book-title">{{ comment.bookTitle }}</h3>
            <div class="rating" :title="`${comment.rating}/5`">
              {{ getRatingStars(comment.rating) }}
            </div>
          </div>
        </router-link>

        <div class="comment-content">
          <p class="comment-text">{{ comment.content }}</p>
          <div class="comment-meta">
            <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
            <button 
              class="delete-button"
              @click="handleDeleteComment(comment.id)"
              title="Yorumu Sil"
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalItems > itemsPerPage" class="pagination">
      <button
        v-for="page in Math.ceil(totalItems / itemsPerPage)"
        :key="page"
        class="page-button"
        :class="{ active: currentPage === page }"
        @click="handlePageChange(page)"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-comments {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    color: var(--color-text-primary);
    margin: 0;
  }
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-card-bg);
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: var(--color-error);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text-secondary);

  p {
    margin-bottom: 1rem;
  }
}

.browse-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-card {
  background: var(--color-card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.book-info {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid var(--color-border);

  .book-cover {
    width: 60px;
    height: 90px;
    object-fit: cover;
    border-radius: 4px;
  }

  .book-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .book-title {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0;
  }

  .rating {
    color: var(--color-warning);
    font-size: 1.125rem;
    letter-spacing: 2px;
  }
}

.comment-content {
  padding: 1rem;

  .comment-text {
    color: var(--color-text-primary);
    line-height: 1.5;
    margin: 0 0 1rem;
  }

  .comment-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .comment-date {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
    }

    .delete-button {
      padding: 0.25rem 0.75rem;
      border: none;
      border-radius: 4px;
      background: var(--color-error);
      color: white;
      font-size: 0.875rem;
      cursor: pointer;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.9;
      }
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;

  .page-button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-card-bg);
    color: var(--color-text-primary);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--color-primary);
    }

    &.active {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
    }
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .book-info {
    flex-direction: column;
    align-items: center;
    text-align: center;

    .book-cover {
      width: 100px;
      height: 150px;
    }
  }

  .comment-meta {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style> 