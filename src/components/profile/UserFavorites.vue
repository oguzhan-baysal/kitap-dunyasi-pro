<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useStore } from '@/store'
import type { Book } from '@/types/book'

const store = useStore()
const userFavorites = computed<Book[]>(() => store.getters['books/userFavorites'] || [])

const isLoading = ref(true)
const errorMessage = ref('')

const currentPage = ref(1)
const itemsPerPage = 12
const totalItems = ref(0)

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

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadFavorites()
}

onMounted(loadFavorites)
</script>

<template>
  <div class="user-favorites">
    <div class="favorites-header">
      <h2>Favori Kitaplarım</h2>
    </div>

    <div v-if="isLoading" class="loading">
      <span class="loading-text">Yükleniyor...</span>
    </div>

    <div v-else-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <div v-else-if="userFavorites.length === 0" class="no-favorites">
      <p>Henüz favori kitabınız bulunmuyor.</p>
    </div>

    <div v-else class="favorites-grid">
      <div v-for="book in userFavorites" :key="book.id" class="book-card">
        <img :src="book.coverImage" :alt="book.title" class="book-cover">
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p class="author">{{ book.author }}</p>
          <p class="price">{{ book.price }} TL</p>
        </div>
      </div>
    </div>

    <div v-if="userFavorites.length > itemsPerPage" class="pagination">
      <button 
        :disabled="currentPage === 1" 
        @click="handlePageChange(currentPage - 1)"
      >
        Önceki
      </button>
      <span>{{ currentPage }}</span>
      <button 
        :disabled="currentPage * itemsPerPage >= totalItems" 
        @click="handlePageChange(currentPage + 1)"
      >
        Sonraki
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

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
}

.error {
  text-align: center;
  padding: 2rem;
  color: var(--color-error);
}

.no-favorites {
  text-align: center;
  padding: $spacing-8;
  color: var(--color-text-light);
}

.favorites-grid {
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

    .price {
      font-weight: bold;
      color: var(--color-text-primary);
      margin: 5px 0;
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;

  button {
    padding: 8px 15px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-card-bg);
    color: var(--color-text-primary);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--color-primary);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    padding: 0 10px;
  }
}

@media (max-width: 768px) {
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