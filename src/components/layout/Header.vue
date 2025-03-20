<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import CurrencySelector from '@/components/ui/CurrencySelector.vue'

const store = useStore()
const isLoggedIn = computed(() => store.getters['auth/isLoggedIn'])
const user = computed(() => store.getters['auth/user'])

const logout = () => {
  store.dispatch('auth/logout')
}
</script>

<template>
  <header class="header">
    <nav class="nav">
      <RouterLink to="/" class="logo">Kitap Dünyası Pro</RouterLink>
      <div class="nav-right">
        <CurrencySelector />
        <ThemeToggle />
        <template v-if="isLoggedIn">
          <RouterLink to="/profile" class="user-name">{{ user?.name }}</RouterLink>
          <button @click="logout" class="logout-btn">Çıkış Yap</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="login-btn">Giriş Yap</RouterLink>
          <RouterLink to="/register" class="register-btn">Kayıt Ol</RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  text-decoration: none;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: var(--color-text);
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;
}

.user-name:hover {
  color: var(--color-primary);
  background: var(--color-background-soft);
}

.login-btn,
.register-btn,
.logout-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.login-btn {
  color: var(--color-primary);
  background: transparent;
  border: 1px solid var(--color-primary);
}

.register-btn,
.logout-btn {
  color: white;
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.login-btn:hover,
.register-btn:hover,
.logout-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style> 