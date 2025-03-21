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
  minYear: '',
  maxYear: '',
  minPages: '',
  maxPages: '',
  isFree: null as boolean | null
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
    minYear: '',
    maxYear: '',
    minPages: '',
    maxPages: '',
    isFree: null
  }
  handleFilter()
}

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="book-filter">
    <div class="search-box">
      <i class="fas fa-search search-icon"></i>
      <input 
        v-model="filters.search"
        type="text"
        placeholder="Kitap ara..."
        @input="handleFilter"
      >
    </div>
    
    <div class="filter-section">
      <h3>Temel Filtreler</h3>
      <div class="filter-group">
        <div class="select-wrapper">
          <i class="fas fa-book-open"></i>
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
        </div>
        
        <div class="select-wrapper">
          <i class="fas fa-language"></i>
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
      </div>
    </div>
    
    <div class="filter-section">
      <h3>Fiyat Aralığı</h3>
      <div class="filter-group">
        <div class="input-wrapper">
          <i class="fas fa-tag"></i>
          <input 
            v-model="filters.minPrice"
            type="number"
            :placeholder="'Min ' + selectedCurrency"
            @input="handleFilter"
          >
        </div>
        <div class="input-wrapper">
          <i class="fas fa-tag"></i>
          <input 
            v-model="filters.maxPrice"
            type="number"
            :placeholder="'Max ' + selectedCurrency"
            @input="handleFilter"
          >
        </div>
      </div>
      
      <div class="checkbox-group">
        <label class="checkbox-wrapper">
          <input 
            type="checkbox"
            v-model="filters.isFree"
            @change="handleFilter"
          >
          <span class="checkbox-label">Sadece Ücretsiz Kitaplar</span>
        </label>
      </div>
    </div>
    
    <div class="filter-section">
      <h3>Yayın Yılı</h3>
      <div class="filter-group">
        <div class="input-wrapper">
          <i class="fas fa-calendar"></i>
          <input 
            v-model="filters.minYear"
            type="number"
            :placeholder="'Min Yıl'"
            :max="currentYear"
            @input="handleFilter"
          >
        </div>
        <div class="input-wrapper">
          <i class="fas fa-calendar"></i>
          <input 
            v-model="filters.maxYear"
            type="number"
            :placeholder="'Max Yıl'"
            :max="currentYear"
            @input="handleFilter"
          >
        </div>
      </div>
    </div>
    
    <div class="filter-section">
      <h3>Sayfa Sayısı</h3>
      <div class="filter-group">
        <div class="input-wrapper">
          <i class="fas fa-file-alt"></i>
          <input 
            v-model="filters.minPages"
            type="number"
            placeholder="Min Sayfa"
            @input="handleFilter"
          >
        </div>
        <div class="input-wrapper">
          <i class="fas fa-file-alt"></i>
          <input 
            v-model="filters.maxPages"
            type="number"
            placeholder="Max Sayfa"
            @input="handleFilter"
          >
        </div>
      </div>
    </div>
    
    <button class="clear-btn" @click="clearFilters">
      <i class="fas fa-times"></i>
      Filtreleri Temizle
    </button>
  </div>
</template>

<style lang="scss" scoped>
.book-filter {
  padding: 1.5rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.filter-section {
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 0.9rem;
    color: var(--color-text-light);
    margin-bottom: 0.75rem;
    font-weight: 600;
  }
}

.search-box {
  margin-bottom: 1.5rem;
  position: relative;
  
  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-light);
  }
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
    }
  }
}

.filter-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.select-wrapper, .input-wrapper {
  flex: 1;
  position: relative;
  
  i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-light);
    z-index: 1;
  }
  
  select, input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 0.9rem;
    background: var(--color-background);
    transition: all 0.3s ease;
    
    &:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
    }
  }
  
  select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1em;
  }
}

.checkbox-group {
  margin-top: 0.75rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  
  input[type="checkbox"] {
    margin-right: 0.5rem;
    cursor: pointer;
  }
  
  .checkbox-label {
    font-size: 0.9rem;
    color: var(--color-text);
  }
}

.clear-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  i {
    font-size: 0.9rem;
  }
  
  &:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

// Responsive tasarım
@media (max-width: 768px) {
  .filter-group {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .book-filter {
    padding: 1rem;
  }
}
</style> 