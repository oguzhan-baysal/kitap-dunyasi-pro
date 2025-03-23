<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from '@/store';
import { RouterView } from 'vue-router';
import Header from '@/components/layout/Header.vue';
import { useTheme } from '@/composables/useTheme'

const store = useStore();
const { initTheme, watchSystemTheme } = useTheme()

onMounted(async () => {
  // Auth durumunu kontrol et
  await store.dispatch('auth/checkAuth');
  
  // Kitapları yükle
  await store.dispatch('books/initialize');
  
  // Döviz kurlarını yükle
  await store.dispatch('currency/fetchRates');
  store.dispatch('currency/startAutoUpdate');
  
  // Tema ayarlarını başlat
  initTheme()
  watchSystemTheme()
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
  background-color: var(--color-background);
  color: var(--color-text);
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
  --color-card-bg: #ffffff;

  // Kenarlık renkleri
  --color-border: #e2e8f0;
  --color-border-hover: #cbd5e1;

  // Form ve UI elementleri
  --color-input-bg: #ffffff;
  --color-button-text: #000000;
  --color-button-bg: #ffffff;
}

[data-theme="dark"] {
  // Ana renkler
  --color-primary: #60a5fa;
  --color-primary-dark: #3b82f6;
  --color-primary-light: #93c5fd;
  --color-secondary: #4b5563;
  --color-success: #059669;
  --color-error: #dc2626;
  --color-warning: #d97706;
  --color-info: #0284c7;

  // Metin renkleri
  --color-text: #e2e8f0;
  --color-text-light: #cbd5e1;
  --color-heading: #f1f5f9;
  --color-link: #60a5fa;

  // Arkaplan renkleri
  --color-background: #0f172a;
  --color-background-soft: #1e293b;
  --color-background-mute: #334155;
  --color-card-bg: #1e293b;

  // Kenarlık renkleri
  --color-border: #334155;
  --color-border-hover: #475569;

  // Form ve UI elementleri
  --color-input-bg: #1e293b;
  --color-button-text: #ffffff;
  --color-button-bg: #1e293b;
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

button {
  background-color: var(--color-button-bg);
  color: var(--color-button-text);
  border: 1px solid var(--color-border);
  
  &:hover {
    border-color: var(--color-border-hover);
  }
}

input, select, textarea {
  background-color: var(--color-input-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  
  &:focus {
    border-color: var(--color-primary);
  }
}

.card {
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border);
}

[role="link"] {
  cursor: pointer;
  display: inline-block;
}
</style>
