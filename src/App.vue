<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from '@/store';
import { RouterView } from 'vue-router';
import Header from '@/components/layout/Header.vue';

const store = useStore();

onMounted(async () => {
  // Auth durumunu kontrol et
  await store.dispatch('auth/checkAuth');
  
  // Kitapları yükle
  await store.dispatch('books/initialize');
  
  // Döviz kurlarını yükle
  await store.dispatch('currency/fetchRates');
  store.dispatch('currency/startAutoUpdate');
  
  // Tema durumunu kontrol et
  store.dispatch('ui/initializeTheme');
});
</script>

<template>
  <div class="app-container">
    <Header />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss">
@use '@/assets/styles/_variables.scss' as *;

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: $spacing-4;
}

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
}

:root.dark {
  // Ana renkler
  --color-primary: #90caf9;
  --color-primary-dark: #42a5f5;
  --color-primary-light: #e3f2fd;
  --color-secondary: #ce93d8;
  --color-success: #66bb6a;
  --color-error: #f44336;
  --color-warning: #ffa726;
  --color-info: #29b6f6;

  // Metin renkleri
  --color-text: #e2e8f0;
  --color-text-light: #94a3b8;
  --color-heading: #f8fafc;
  --color-link: var(--color-primary);

  // Arkaplan renkleri
  --color-background: #0f172a;
  --color-background-soft: #1e293b;
  --color-background-mute: #334155;

  // Kenarlık renkleri
  --color-border: #334155;
  --color-border-hover: #475569;
}

* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
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

[role="link"] {
  cursor: pointer;
  display: inline-block;
}
</style>
