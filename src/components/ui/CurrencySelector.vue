<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const selectedCurrency = computed(() => store.getters['currency/getSelectedCurrency'])

const handleCurrencyChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  store.dispatch('currency/setSelectedCurrency', target.value)
}
</script>

<template>
  <select 
    v-model="selectedCurrency"
    @change="handleCurrencyChange($event)"
    class="currency-selector"
  >
    <option value="TRY">TRY</option>
    <option value="USD">USD</option>
    <option value="EUR">EUR</option>
    <option value="GBP">GBP</option>
  </select>
</template>

<style scoped>
.currency-selector {
  [data-theme="dark"] & {
    select {
      background: #ffffff !important;
      color: #000000 !important;
      border: 1px solid #e5e7eb;
    }
  }

  select {
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background-color: #ffffff;
    color: #000000;
    font-size: 0.9rem;
  }
}

.currency-selector:focus {
  outline: none;
  border-color: #4CAF50;
}
</style> 