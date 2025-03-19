<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const availableCurrencies = computed(() => store.getters['currency/availableCurrencies'])
const selectedCurrency = computed({
  get: () => store.state.currency.selectedCurrency,
  set: (value) => store.dispatch('currency/setSelectedCurrency', value)
})

const filters = ref({
  search: '',
  category: '',
  language: '',
  minPrice: '',
  maxPrice: '',
  year: '',
  pageCount: ''
})

const categories = [
  'Roman',
  'Öykü',
  'Şiir',
  'Bilim',
  'Tarih',
  'Felsefe'
]

const languages = [
  'Türkçe',
  'İngilizce',
  'Almanca',
  'Fransızca'
]

const emit = defineEmits(['filter'])

const handleFilter = () => {
  emit('filter', filters.value)
}

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    language: '',
    minPrice: '',
    maxPrice: '',
    year: '',
    pageCount: ''
  }
  handleFilter()
}
</script>

<template>
  <div class="book-filter">
    <div class="search-box">
      <input 
        v-model="filters.search"
        type="text"
        placeholder="Kitap ara..."
        @input="handleFilter"
      >
    </div>
    
    <div class="filter-group">
      <select v-model="filters.category" @change="handleFilter">
        <option value="">Kategori Seçin</option>
        <option 
          v-for="category in categories" 
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
      
      <select v-model="filters.language" @change="handleFilter">
        <option value="">Dil Seçin</option>
        <option 
          v-for="language in languages" 
          :key="language"
          :value="language"
        >
          {{ language }}
        </option>
      </select>
    </div>
    
    <div class="filter-group">
      <input 
        v-model="filters.minPrice"
        type="number"
        placeholder="Min Fiyat"
        @input="handleFilter"
      >
      <input 
        v-model="filters.maxPrice"
        type="number"
        placeholder="Max Fiyat"
        @input="handleFilter"
      >
    </div>
    
    <div class="filter-group">
      <input 
        v-model="filters.year"
        type="number"
        placeholder="Yayın Yılı"
        @input="handleFilter"
      >
      <input 
        v-model="filters.pageCount"
        type="number"
        placeholder="Sayfa Sayısı"
        @input="handleFilter"
      >
    </div>
    
    <button class="clear-btn" @click="clearFilters">
      Filtreleri Temizle
    </button>
  </div>
</template>

<style lang="scss" scoped>
.book-filter {
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-box {
  margin-bottom: 1rem;
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
}

.filter-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  select, input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
}

.clear-btn {
  width: 100%;
  padding: 0.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
}
</style> 