<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/store'
import BookSlider from '@/components/books/BookSlider.vue'
import BookCard from '@/components/books/BookCard.vue'
import BookListItem from '@/components/books/BookListItem.vue'
import CurrencySelector from '@/components/ui/CurrencySelector.vue'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { useViewMode } from '@/composables/useViewMode'
import BookFilter from '@/components/books/BookFilter.vue'

const store = useStore()
const showFilters = ref(false)
const books = computed(() => store.getters['books/getFilteredAndSortedBooks'])
const loading = computed(() => store.state.books.loading)
const hasMore = computed(() => store.state.books.hasMore)

const sortOptions = [
  { field: 'title', label: 'İsme Göre' },
  { field: 'price', label: 'Fiyata Göre' },
  { field: 'rating', label: 'Puana Göre' },
  { field: 'publishDate', label: 'Tarihe Göre' }
]

const currentSort = computed(() => store.state.books.sort)

const updateSort = (field: string) => {
  const order = currentSort.value.field === field ? 
    (currentSort.value.order === 'desc' ? 'asc' : 'desc') : 
    'asc'
  store.commit('books/UPDATE_SORT', { field, order })
}

const loadMore = async () => {
  if (hasMore.value && !loading.value) {
    await store.dispatch('books/loadMoreBooks')
  }
}

const { isLoading } = useInfiniteScroll(loadMore)
const { viewMode, toggleViewMode } = useViewMode()

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const handleFilter = (filters: any) => {
  store.commit('books/SET_FILTERS', filters)
}

onMounted(async () => {
  await store.dispatch('books/initialize')
})
</script>

<template>
  <main class="home">
    <section class="featured-books">
      <h1>Öne Çıkan Kitaplar</h1>
      <BookSlider />
    </section>

    <section class="all-books">
      <div class="section-header">
        <div class="header-left">
          <h2>Kitaplar</h2>
          <div class="filter-buttons">
            <button 
              class="filter-toggle"
              @click="toggleFilters"
            >
              <i class="fas fa-filter"></i>
              {{ showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster' }}
            </button>
            <button 
              v-for="option in sortOptions"
              :key="option.field"
              :class="{ active: currentSort.field === option.field }"
              @click="updateSort(option.field)"
            >
              {{ option.label }}
              <span class="sort-indicator" v-if="currentSort.field === option.field">
                {{ currentSort.order === 'asc' ? '↑' : '↓' }}
              </span>
            </button>
            <div class="view-controls">
              <CurrencySelector />
              <button 
                class="view-toggle"
                @click="toggleViewMode"
              >
                {{ viewMode === 'grid' ? 'Liste Görünümü' : 'Grid Görünümü' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Transition name="slide">
        <BookFilter
          v-if="showFilters"
          @filter="handleFilter"
        />
      </Transition>

      <div 
        class="books-container"
        :class="viewMode"
      >
        <div v-if="books.length === 0 && !loading" class="no-books">
          Henüz kitap bulunmuyor.
        </div>
        
        <template v-else>
          <template v-if="viewMode === 'grid'">
            <BookCard
              v-for="book in books"
              :key="book.id"
              :book="book"
            />
          </template>
          <template v-else>
            <BookListItem
              v-for="book in books"
              :key="book.id"
              :book="book"
            />
          </template>
        </template>
      </div>

      <div v-if="loading || isLoading" class="loading">
        <span class="loader"></span>
      </div>

      <div v-if="!hasMore && books.length > 0" class="no-more">
        Başka kitap kalmadı.
      </div>
    </section>
  </main>
</template>

<style lang="scss">
@use '@/assets/styles/_variables.scss' as *;

.home {
  padding: $spacing-6;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
}

.books-section {
  margin-top: $spacing-6;
}

.featured-books {
  margin-bottom: $spacing-8;
  background: var(--color-background-soft);
  padding: $spacing-6;
  border-radius: $border-radius-lg;
  width: 100%;

  h1 {
    font-size: $font-size-2xl;
    color: var(--color-heading);
    margin-bottom: $spacing-6;
    text-align: center;
  }
}

.all-books {
  flex: 1;
  width: 100%;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-6;
    width: 100%;

    .header-left {
      display: flex;
      align-items: center;
      gap: $spacing-4;
      flex: 1;

      h2 {
        font-size: $font-size-xl;
        color: var(--color-heading);
        margin: 0;
        white-space: nowrap;
      }
    }

    .filter-buttons {
      display: flex;
      gap: $spacing-2;
      align-items: center;
      flex: 1;

      .view-controls {
        display: flex;
        gap: $spacing-2;
        align-items: center;
        margin-left: auto;
      }

      button {
        padding: $spacing-2 $spacing-4;
        border: 1px solid var(--color-border);
        border-radius: $border-radius;
        background: #ffffff;
        color: #000000;
        cursor: pointer;
        transition: none;
        font-size: $font-size-sm;
        height: 36px;
        min-width: fit-content;
        
        &:hover {
          background: #ffffff !important;
          border-color: var(--color-border);
        }
        
        &.active {
          background: var(--color-primary) !important;
          color: #ffffff;
        }

        .sort-indicator {
          margin-left: $spacing-1;
        }
      }
    }

    .view-toggle {
      padding: $spacing-2 $spacing-4;
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: $border-radius;
      color: #000000;
      font-size: $font-size-sm;
      cursor: pointer;
      transition: none;
      min-width: 140px;
      height: 36px;
      margin-left: auto;

      &:hover {
        background: #ffffff !important;
        border-color: var(--color-border);
        color: var(--color-primary);
      }
    }
  }
}

.books-container {
  margin-bottom: $spacing-6;
  min-height: 200px;
  width: 100%;
  display: grid;

  &.grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: $spacing-4;
    
    .book-card {
      width: 100%;
      max-width: 100%;
      margin: 0;
    }
  }

  &.list {
    display: flex;
    flex-direction: column;
    gap: $spacing-4;
  }
}

.loading {
  display: flex;
  justify-content: center;
  padding: $spacing-8;

  .loader {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border);
    border-radius: 50%;
    border-top-color: var(--color-primary);
    animation: spin 1s linear infinite;
  }
}

.no-more {
  text-align: center;
  padding: $spacing-8;
  color: var(--color-text-light);
}

.no-books {
  text-align: center;
  padding: $spacing-8;
  color: var(--color-text-light);
  font-size: $font-size-lg;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1200px) {
  .books-container.grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .home {
    padding: $spacing-4;
  }

  .featured-books {
    padding: $spacing-4;
    margin-bottom: $spacing-6;
  }

  .section-header {
    .header-left {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      gap: $spacing-4;
    }

    .filter-buttons {
      width: 100%;
      justify-content: flex-start;
      
      button {
        flex: 1;
        justify-content: space-between;
      }
    }

    .view-toggle {
      width: 100%;
      justify-content: center;
    }
  }

  .books-container.grid {
    grid-template-columns: 1fr;
  }
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  padding: $spacing-2 $spacing-4;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: $border-radius;
  color: #000000;
  font-size: $font-size-sm;
  cursor: pointer;
  transition: none;
  height: 36px;

  i {
    font-size: 0.9em;
  }

  &:hover {
    background: #ffffff !important;
    border-color: var(--color-border);
    color: var(--color-primary);
  }

  &:active {
    transform: translateY(1px);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.filter-button,
.sort-button {
  background-color: var(--color-background-soft);
  color: var(--button-text-color);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: inherit;
    border-color: inherit;
  }

  &.active {
    background-color: var(--color-active-bg);
    color: var(--button-text-color);
  }
}

.filter-label,
.sort-label {
  color: var(--filter-text-color);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

select,
input {
  background-color: var(--color-input-bg);
  color: var(--input-text-color);
  border: 1px solid var(--color-border);
  padding: 0.5rem;
  border-radius: 0.375rem;
  width: 100%;

  &::placeholder {
    color: var(--input-placeholder-color);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

[data-theme="dark"] {
  .filter-buttons button,
  .filter-toggle,
  .view-toggle {
    background: #ffffff !important;
    color: #000000;
    border: 1px solid #e5e7eb;
    
    &:hover {
      background: #ffffff !important;
      border-color: #e5e7eb;
    }
    
    &.active {
      background: var(--color-primary) !important;
      color: #ffffff;
      border-color: var(--color-primary);
    }
  }
}

.filter-buttons {
  button {
    background: #ffffff;
    color: #000000;
    border: 1px solid var(--color-border);
    transition: none;
    
    &:hover {
      background: #ffffff !important;
      border-color: var(--color-border);
    }
    
    &.active {
      background: var(--color-primary) !important;
      color: #ffffff;
      border-color: var(--color-primary);
    }
  }
}

.filter-button,
.sort-button,
.view-toggle,
.filter-toggle {
  transition: none !important;
  
  &:hover {
    background: inherit !important;
    border-color: inherit !important;
    transform: none !important;
  }
}

button {
  &:hover {
    background: inherit !important;
    border-color: inherit !important;
  }
}
</style> 