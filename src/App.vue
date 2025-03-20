<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from '@/store';
import { RouterView } from 'vue-router';

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
  <div class="app-container">
    <header class="header">
      <nav class="nav-container">
        <router-link to="/" class="logo">
          Kitap Dünyası
        </router-link>
        
        <div class="nav-links">
          <router-link to="/" class="nav-link" active-class="active">
            Ana Sayfa
          </router-link>
          <router-link to="/books" class="nav-link" active-class="active">
            Kitaplar
          </router-link>
        </div>

        <div class="auth-buttons">
          <router-link to="/login" class="auth-button">
            Giriş Yap
          </router-link>
          <router-link to="/register" class="auth-button register">
            Kayıt Ol
          </router-link>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/_variables.scss';

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.header {
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: $spacing-4 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-4;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: var(--color-heading);
  text-decoration: none;
  
  &:hover {
    color: var(--color-primary);
  }
}

.nav-links {
  display: flex;
  gap: $spacing-6;
  
  .nav-link {
    color: var(--color-text);
    text-decoration: none;
    font-weight: $font-weight-medium;
    transition: color 0.2s;
    
    &:hover,
    &.active {
      color: var(--color-primary);
    }
  }
}

.auth-buttons {
  display: flex;
  gap: $spacing-3;
  
  .auth-button {
    padding: $spacing-2 $spacing-4;
    border-radius: $border-radius;
    text-decoration: none;
    font-weight: $font-weight-medium;
    transition: all 0.2s;
    
    &:not(.register) {
      color: var(--color-text);
      
      &:hover {
        color: var(--color-primary);
      }
    }
    
    &.register {
      background: var(--color-primary);
      color: white;
      
      &:hover {
        background: var(--color-primary-dark);
      }
    }
  }
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: $spacing-4;
    text-align: center;
  }
  
  .nav-links,
  .auth-buttons {
    width: 100%;
    justify-content: center;
  }
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

[role="link"] {
  cursor: pointer;
  display: inline-block;
}
</style>
