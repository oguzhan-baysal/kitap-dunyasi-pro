<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()

const currencies = ['TRY', 'USD', 'EUR', 'GBP']
const selectedCurrency = computed(() => store.getters['currency/getSelectedCurrency'])

const handleCurrencyChange = (currency: string) => {
  store.dispatch('currency/setSelectedCurrency', currency)
}
</script>

<template>
  <div class="currency-selector">
    <select 
      :value="selectedCurrency"
      @change="handleCurrencyChange($event.target.value)"
      class="currency-select"
    >
      <option v-for="currency in currencies" :key="currency" :value="currency">
        {{ currency }}
      </option>
    </select>
  </div>
</template>

<style lang="scss" scoped>
.currency-selector {
  position: relative;
  
  .currency-select {
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-background);
    color: var(--color-text);
    cursor: pointer;
    font-size: 0.875rem;
    
    &:hover {
      border-color: var(--color-primary);
    }
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
    }
  }
}
</style> 