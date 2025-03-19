<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import { RootState } from './store/types';

const store = useStore<RootState>();

onMounted(async () => {
  // Initialize store modules
  await store.dispatch('auth/initializeFromStorage');
  await store.dispatch('books/fetchBooks');
  await store.dispatch('currency/fetchRates');
  await store.dispatch('favorites/initialize');
  await store.dispatch('ui/initialize');
});
</script>

<template>
  <div id="app" :data-theme="store.state.ui.theme">
    <router-view />
  </div>
</template>

<style lang="scss">
:root {
  // Renkler
  --color-primary: #1976d2;
  --color-primary-dark: #1565c0;
  --color-secondary: #424242;
  --color-accent: #82b1ff;
  --color-error: #ff5252;
  --color-success: #4caf50;
  --color-warning: #fb8c00;
  --color-info: #2196f3;

  // Metin renkleri
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-text-light: #999999;

  // Arka plan renkleri
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-card-bg: #ffffff;

  // Kenarlık renkleri
  --color-border: #e0e0e0;
}

body {
  margin: 0;
  font-family: $font-family-base;
  font-size: $font-size-base;
  line-height: $line-height-base;
  color: var(--color-text-primary);
  background-color: var(--color-bg-secondary);
}

#app {
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

* {
  box-sizing: border-box;
}

a {
  color: var(--color-primary);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

button {
  font-family: inherit;
}
</style>
