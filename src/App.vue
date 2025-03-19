<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from '@/store';
import { RouterView } from 'vue-router';
import Navbar from '@/components/layout/Navbar.vue';

const store = useStore();

onMounted(async () => {
  // Auth durumunu kontrol et
  await store.dispatch('auth/checkAuth');
  
  // Kitapları yükle
  await store.dispatch('books/initialize');
  
  // Döviz kurlarını yükle
  await store.dispatch('currency/fetchRates');
});
</script>

<template>
  <Navbar />
  <RouterView />
</template>

<style lang="scss">
:root {
  // Ana renkler
  --color-primary: #1976d2;
  --color-primary-dark: #1565c0;
  --color-primary-light: #42a5f5;
  --color-secondary: #9c27b0;
  --color-success: #2e7d32;
  --color-error: #d32f2f;
  --color-warning: #ed6c02;
  --color-info: #0288d1;

  // Metin renkleri
  --color-text: #213547;
  --color-text-light: #4a5568;
  --color-heading: #1a202c;
  --color-link: var(--color-primary);

  // Arkaplan renkleri
  --color-background: #ffffff;
  --color-background-soft: #f8fafc;
  --color-background-mute: #f1f5f9;

  // Kenarlık renkleri
  --color-border: #e2e8f0;
  --color-border-hover: #cbd5e1;
  --color-divider: #e2e8f0;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  position: relative;
  font-weight: normal;
}

body {
  min-height: 100vh;
  color: var(--color-text);
  background: var(--color-background);
  line-height: 1.6;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  text-decoration: none;
  color: var(--color-link);
  transition: 0.4s;
  padding: 3px;
}

button {
  cursor: pointer;
  font-family: inherit;
}

@media (hover: hover) {
  a:hover {
    background-color: var(--color-background-soft);
  }
}
</style>
