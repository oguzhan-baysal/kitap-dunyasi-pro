<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import type { Book } from '@/types'

const store = useStore()
const books = ref<Book[]>([])
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

    const response = await store.dispatch('books/getUserBooks', {
      page: currentPage.value,
      limit: itemsPerPage,
      sort: selectedSort.value
    })

    books.value = response.books
    totalItems.value = response.total

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

const handleDelete = async (bookId: string) => {
  if (!confirm('Bu kitabı silmek istediğinize emin misiniz?')) return

  try {
    await store.dispatch('books/deleteBook', bookId)
    await loadBooks()
  } catch (error) {
    errorMessage.value = 'Kitap silinirken bir hata oluştu'
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

        <router-link to="/books/new" class="add-button">
          Yeni Kitap Ekle
        </router-link>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      Kitaplar yükleniyor...
    </div>

    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-else-if="books.length === 0" class="empty-state">
      <p>Henüz kitap eklememişsiniz.</p>
      <router-link to="/books/new" class="add-button">
        İlk Kitabınızı Ekleyin
      </router-link>
    </div>

    <div v-else class="books-grid">
      <div 
        v-for="book in books"
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
          <p class="book-price">{{ book.price }} TL</p>
        </div>

        <div class="card-actions">
          <router-link 
            :to="`/books/${book.id}/edit`"
            class="edit-button"
          >
            Düzenle
          </router-link>

          <button 
            class="delete-button"
            @click="handleDelete(book.id)"
          >
            Sil
          </button>
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
.user-books {
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

.add-button {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
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
  padding: 4rem 2rem;
  color: var(--color-text-secondary);

  p {
    margin-bottom: 1rem;
  }
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}

.book-card {
  background: var(--color-card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}

.book-cover {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.book-info {
  padding: 1rem;

  .book-title {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .book-author {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0 0 0.5rem;
  }

  .book-price {
    font-weight: 500;
    color: var(--color-primary);
    margin: 0;
  }
}

.card-actions {
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
  border-top: 1px solid var(--color-border);

  .edit-button, .delete-button {
    flex: 1;
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }

  .edit-button {
    background: var(--color-primary);
    color: white;
  }

  .delete-button {
    background: var(--color-error);
    color: white;
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
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }

  .book-cover {
    height: 220px;
  }
}
</style> 