<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import type { Book } from '@/types/book'

const store = useStore()
const router = useRouter()

const userFavorites = computed<Book[]>(() => store.getters['books/userFavorites'] || [])

const isLoading = ref(true)
const errorMessage = ref('')

const currentPage = ref(1)
const itemsPerPage = 12
const totalItems = ref(0)

const sortOptions = [
  { value: 'date-desc', label: 'Son Eklenenler' },
  { value: 'date-asc', label: 'İlk Eklenenler' },
  { value: 'title-asc', label: 'İsme Göre (A-Z)' },
  { value: 'title-desc', label: 'İsme Göre (Z-A)' },
  { value: 'price-asc', label: 'Fiyat (Düşük-Yüksek)' },
  { value: 'price-desc', label: 'Fiyat (Yüksek-Düşük)' }
]

const selectedSort = ref('date-desc')

const loadFavorites = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    await store.dispatch('books/fetchUserFavorites')

  } catch (error) {
    errorMessage.value = 'Favoriler yüklenirken bir hata oluştu'
  } finally {
    isLoading.value = false
  }
}

const handleSort = (value: string) => {
  selectedSort.value = value
  currentPage.value = 1
  loadFavorites()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadFavorites()
}

const handleRemoveFavorite = async (bookId: string) => {
  try {
    await store.dispatch('favorites/removeFavorite', bookId)
    await loadFavorites()
  } catch (error) {
    errorMessage.value = 'Kitap favorilerden çıkarılırken bir hata oluştu'
  }
}

function viewBook(bookId: string) {
  router.push(`/books/${bookId}`)
}

function removeFavorite(bookId: string) {
  store.dispatch('books/toggleFavorite', bookId)
}

onMounted(loadFavorites)
</script>

<template>
  <div class="user-favorites">
    <div class="header">
      <h2>Favori Kitaplarım</h2>
      
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
      Favoriler yükleniyor...
    </div>

    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-else-if="userFavorites.length === 0" class="empty-state">
      <i class="fas fa-heart"></i>
      <p>Henüz favori kitabınız yok</p>
    </div>

    <div v-else class="favorites-grid">
      <div v-for="book in userFavorites" :key="book.id" class="favorite-card">
        <img :src="book.coverImage" :alt="book.title" class="book-cover">
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p class="author">{{ book.author }}</p>
          <div class="book-actions">
            <button @click="viewBook(book.id)" class="btn-view">
              <i class="fas fa-eye"></i>
              İncele
            </button>
            <button @click="removeFavorite(book.id)" class="btn-remove">
              Favorilerden Çıkar
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

.user-favorites {
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

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-6;
}

.favorite-card {
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

    h3 {
      font-size: $font-size-lg;
      color: var(--color-heading);
      margin-bottom: $spacing-2;
    }

    .author {
      color: var(--color-text-light);
      font-size: $font-size-sm;
      margin-bottom: $spacing-4;
    }
  }
}

.book-actions {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;

  button {
    width: 100%;
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
    min-height: 36px;
    color: white;

    i {
      font-size: $font-size-base;
    }

    &.btn-view {
      background: var(--color-primary);

      &:hover {
        background: var(--color-primary-dark);
      }
    }

    &.btn-remove {
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

  .favorites-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .book-cover {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style> 