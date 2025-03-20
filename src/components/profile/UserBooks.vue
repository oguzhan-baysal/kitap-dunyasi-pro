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

const sortOptions = [
  { value: 'date-desc', label: 'En Yeniler' },
  { value: 'date-asc', label: 'En Eskiler' },
  { value: 'title-asc', label: 'İsme Göre (A-Z)' },
  { value: 'title-desc', label: 'İsme Göre (Z-A)' }
]

const selectedSort = ref('date-desc')

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

const handleSort = (value: string) => {
  selectedSort.value = value
  currentPage.value = 1
  loadBooks()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadBooks()
}

const editBook = (bookId: string) => {
  router.push(`/books/${bookId}/edit`)
}

const deleteBook = (bookId: string) => {
  if (confirm('Bu kitabı silmek istediğinizden emin misiniz?')) {
    store.dispatch('books/deleteBook', bookId)
  }
}

onMounted(loadBooks)
</script>

<template>
  <div class="user-books">
    <div class="header">
      <h2>Kitaplarım</h2>
      
      <div class="actions">
        <select 
          v-model="selectedSort"
          class="sort-select"
          @change="handleSort($event.target.value)"
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

  h2 {
    color: var(--color-heading);
    margin-bottom: $spacing-6;
    font-size: $font-size-xl;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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
    font-weight: 500;
    color: var(--color-heading);
    margin: 0 0 $spacing-2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .book-author {
    color: var(--color-text-light);
    font-size: $font-size-sm;
    margin-bottom: $spacing-4;
  }
}

.book-actions {
  display: flex;
  gap: $spacing-2;
  margin-top: $spacing-4;

  button {
    flex: 1;
    padding: $spacing-2 $spacing-4;
    border-radius: 4px;
    font-size: $font-size-sm;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-2;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    font-weight: 500;
    min-width: 100px;
    color: white;

    i {
      font-size: $font-size-base;
    }

    &.btn-edit {
      background: var(--color-primary);

      &:hover {
        background: var(--color-primary-dark);
      }
    }

    &.btn-delete {
      background: #dc3545;

      &:hover {
        background: #c82333;
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