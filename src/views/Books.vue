<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { State } from '@/types/store';
import type { Book } from '@/types/books';
import BookGrid from '@/components/books/BookGrid.vue'
import BookFilter from '@/components/books/BookFilter.vue'

const store = useStore<State>();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const error = ref('');

// Filters and sorting
const searchQuery = ref(route.query.q?.toString() || '');
const selectedCategory = ref(route.query.category?.toString() || '');
const selectedSort = ref(route.query.sort?.toString() || 'newest');
const priceRange = ref({
  min: Number(route.query.minPrice) || 0,
  max: Number(route.query.maxPrice) || 1000
});

// Pagination
const currentPage = ref(Number(route.query.page) || 1);
const itemsPerPage = 12;

const categories = computed(() => store.getters['books/categories']);
const books = computed(() => store.getters['books/filteredBooks']);
const totalBooks = computed(() => books.value.length);
const totalPages = computed(() => Math.ceil(totalBooks.value / itemsPerPage));

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return books.value.slice(start, end);
});

const sortOptions = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'oldest', label: 'En Eski' },
  { value: 'price-asc', label: 'Fiyat (Düşükten Yükseğe)' },
  { value: 'price-desc', label: 'Fiyat (Yüksekten Düşüğe)' },
  { value: 'name-asc', label: 'İsim (A-Z)' },
  { value: 'name-desc', label: 'İsim (Z-A)' }
];

const updateQueryParams = () => {
  const query: Record<string, string | number> = {};
  
  if (searchQuery.value) query.q = searchQuery.value;
  if (selectedCategory.value) query.category = selectedCategory.value;
  if (selectedSort.value) query.sort = selectedSort.value;
  if (priceRange.value.min > 0) query.minPrice = priceRange.value.min;
  if (priceRange.value.max < 1000) query.maxPrice = priceRange.value.max;
  if (currentPage.value > 1) query.page = currentPage.value;

  router.push({ query });
};

const handleSearch = () => {
  currentPage.value = 1;
  updateQueryParams();
};

const handleCategoryChange = (category: string) => {
  selectedCategory.value = category;
  currentPage.value = 1;
  updateQueryParams();
};

const handleSortChange = (sort: string) => {
  selectedSort.value = sort;
  currentPage.value = 1;
  updateQueryParams();
};

const handlePriceRangeChange = () => {
  currentPage.value = 1;
  updateQueryParams();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  updateQueryParams();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedSort.value = 'newest';
  priceRange.value = { min: 0, max: 1000 };
  currentPage.value = 1;
  updateQueryParams();
};

const fetchBooks = async () => {
  loading.value = true;
  error.value = '';

  try {
    await store.dispatch('books/fetchBooks');
  } catch (err) {
    error.value = 'Kitaplar yüklenirken bir hata oluştu';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBooks();
});

watch([searchQuery, selectedCategory, selectedSort, priceRange], () => {
  store.commit('books/setFilters', {
    search: searchQuery.value,
    category: selectedCategory.value,
    sort: selectedSort.value,
    priceRange: priceRange.value
  });
});

const viewMode = ref<'grid' | 'list'>('grid')

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}
</script>

<template>
  <div class="books-view">
    <div class="books-header">
      <h1>Kitaplar</h1>
      <button class="view-toggle" @click="toggleViewMode">
        {{ viewMode === 'grid' ? 'Liste Görünümü' : 'Grid Görünümü' }}
      </button>
    </div>
    
    <div class="books-content">
      <BookFilter class="books-filter" />
      <BookGrid :view-mode="viewMode" class="books-grid" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.books-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.books-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    margin: 0;
    font-size: 2rem;
  }
}

.view-toggle {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: var(--color-primary-dark);
  }
}

.books-content {
  display: grid;
  gap: 2rem;
  grid-template-columns: 300px 1fr;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.books-filter {
  background: var(--color-card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  height: fit-content;
}

.books-grid {
  min-height: 500px;
}
</style> 