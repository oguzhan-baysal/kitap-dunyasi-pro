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
  padding: 0.25rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: #ffffff;
  color: #000000;
  font-size: 0.9rem;
  width: 60px;
  text-align: center;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 4px center;
  background-size: 12px;
  padding-right: 20px;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  [data-theme="dark"] & {
    background-color: #ffffff !important;
    color: #000000 !important;
    border: 1px solid #e5e7eb;
  }
}
</style> 