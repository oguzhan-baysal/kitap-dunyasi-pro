<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const store = useStore()
const isLoggedIn = computed(() => store.getters['auth/isLoggedIn'])
const user = computed(() => store.getters['auth/user'])
const isMobileMenuOpen = ref(false)

const logout = () => {
  store.dispatch('auth/logout')
  isMobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="header">
    <nav class="nav">
      <RouterLink to="/" class="logo">Kitap Dünyası Pro</RouterLink>
      
      <!-- Mobil Menü Butonu -->
      <button class="mobile-menu-btn show-on-mobile" @click="toggleMobileMenu">
        <span class="menu-icon"></span>
      </button>

      <!-- Navigasyon Menüsü -->
      <div class="nav-right" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
        <ThemeToggle />
        <template v-if="isLoggedIn">
          <RouterLink to="/profile" class="user-name" @click="isMobileMenuOpen = false">
            {{ user?.name }}
          </RouterLink>
          <button @click="logout" class="logout-btn">Çıkış Yap</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="login-btn" @click="isMobileMenuOpen = false">
            Giriş Yap
          </RouterLink>
          <RouterLink to="/register" class="register-btn" @click="isMobileMenuOpen = false">
            Kayıt Ol
          </RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.header {
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: $breakpoint-sm) {
    padding: 0.75rem;
  }
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;

  @media (max-width: $breakpoint-xl) {
    max-width: 1024px;
  }

  @media (max-width: $breakpoint-lg) {
    max-width: 768px;
  }
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  text-decoration: none;
  z-index: 102;

  @media (max-width: $breakpoint-sm) {
    font-size: 1.25rem;
  }
}

.mobile-menu-btn {
  display: none;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 102;

  @media (max-width: $breakpoint-sm) {
    display: block;
  }

  .menu-icon {
    display: block;
    width: 24px;
    height: 2px;
    background-color: var(--color-text);
    position: relative;
    transition: background-color 0.3s;

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 2px;
      background-color: var(--color-text);
      transition: transform 0.3s;
    }

    &::before {
      top: -6px;
    }

    &::after {
      bottom: -6px;
    }
  }

  &.active {
    .menu-icon {
      background-color: transparent;

      &::before {
        transform: rotate(45deg) translate(6px, 6px);
      }

      &::after {
        transform: rotate(-45deg) translate(6px, -6px);
      }
    }
  }
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: $breakpoint-sm) {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-background);
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;
    z-index: 101;
    padding: 2rem;

    &.mobile-menu-open {
      display: flex;
    }
  }
}

.user-name {
  color: var(--color-text);
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;

  @media (max-width: $breakpoint-sm) {
    font-size: 1.25rem;
  }

  &:hover {
    color: var(--color-primary);
    background: var(--color-background-soft);
  }
}

.login-btn,
.register-btn,
.logout-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.875rem;

  @media (max-width: $breakpoint-sm) {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    width: auto;
  }
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