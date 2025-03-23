<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import type { Book } from '@/types/book'

const store = useStore()
const router = useRouter()

const userBooks = computed<Book[]>(() => store.getters['books/userBooks'])

const isLoading = ref(true)
const errorMessage = ref('')

const currentPage = ref(1)
const itemsPerPage = 12
const totalItems = ref(0)

const loadBooks = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    await store.dispatch('books/fetchUserBooks')
    totalItems.value = userBooks.value.length

  } catch (error) {
    errorMessage.value = 'Kitaplar yüklenirken bir hata oluştu'
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadBooks()
}

const editBook = (id: number) => {
  router.push(`/books/${id}/edit`)
}

const deleteBook = (id: number) => {
  if (confirm('Bu kitabı silmek istediğinizden emin misiniz?')) {
    store.dispatch('books/deleteBook', id)
  }
}

onMounted(loadBooks)
</script>

<template>
  <div class="user-books">
    <div class="header">
      <h2>Kitaplarım</h2>
    </div>

    <div v-if="isLoading" class="loading">
      Kitaplar yükleniyor...
    </div>

    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-else-if="userBooks.length === 0" class="empty-state">
      <i class="fas fa-book-open"></i>
      <p>Henüz kitap eklememişsiniz</p>
    </div>

    <div v-else class="books-grid">
      <div 
        v-for="book in userBooks"
        :key="book.id"
        class="book-card"
      >
        <img 
          :src="book.coverImage" 
          :alt="book.title"
          class="book-cover"
        >
        
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
          <div class="book-actions">
            <button @click="editBook(book.id)" class="btn-edit">
              <i class="fas fa-edit"></i>
              Düzenle
            </button>
            <button @click="deleteBook(book.id)" class="btn-delete">
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
@use '@/assets/styles/_variables.scss' as *;

.user-books {
  background: var(--color-background-soft);
  padding: $spacing-6;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  margin-top: $spacing-8;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    color: var(--color-heading);
    margin: 0;
    font-size: $font-size-xl;
  }
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
  padding: $spacing-8;
  color: var(--color-text-light);

  i {
    font-size: $font-size-3xl;
    margin-bottom: $spacing-4;
  }

  p {
    font-size: $font-size-lg;
  }
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-6;
}

.book-card {
  background: var(--color-background);
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: $shadow-sm;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  .book-cover {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .book-info {
    padding: $spacing-4;

    .book-title {
      font-size: $font-size-lg;
      color: var(--color-heading);
      margin-bottom: $spacing-2;
    }

    .book-author {
      color: var(--color-text-light);
      font-size: $font-size-sm;
      margin-bottom: $spacing-4;
    }

    .book-actions {
      display: flex;
      gap: $spacing-2;

      button {
        flex: 1;
        padding: $spacing-2 $spacing-4;
        border: none;
        border-radius: $border-radius;
        cursor: pointer;
        font-size: $font-size-sm;
        transition: all 0.2s;

        &.btn-edit {
          background: var(--color-primary);
          color: white;

          &:hover {
            background: var(--color-primary-dark);
          }

          i {
            margin-right: $spacing-2;
          }
        }

        &.btn-delete {
          background: var(--color-error);
          color: white;

          &:hover {
            background: var(--color-error-dark);
          }
        }
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
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .book-cover {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .books-grid {
    grid-template-columns: 1fr;
  }
}
</style> 