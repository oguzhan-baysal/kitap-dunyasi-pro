<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="logo">
        Kitap Dünyası
      </router-link>
    </div>

    <div class="navbar-menu">
      <router-link to="/" class="nav-link">Ana Sayfa</router-link>
      <router-link to="/books" class="nav-link">Kitaplar</router-link>
    </div>

    <div class="navbar-end">
      <template v-if="isAuthenticated">
        <router-link to="/favorites" class="nav-link">
          <i class="fas fa-heart"></i> Favorilerim
        </router-link>
        <div class="user-menu" @click="toggleUserMenu" ref="userMenuRef">
          <span class="user-name">{{ currentUser?.name }}</span>
          <div v-if="showUserMenu" class="user-menu-dropdown">
            <router-link to="/profile" class="dropdown-item">Profilim</router-link>
            <button @click="handleLogout" class="dropdown-item">Çıkış Yap</button>
          </div>
        </div>
      </template>
      <template v-else>
        <router-link to="/login" class="nav-link">Giriş Yap</router-link>
        <router-link to="/register" class="nav-button">Kayıt Ol</router-link>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'

const store = useStore()
const router = useRouter()

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const currentUser = computed(() => store.getters['auth/currentUser'])

const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

const handleLogout = async () => {
  try {
    await store.dispatch('auth/logout')
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: var(--color-background);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-primary);
    text-decoration: none;

    &:hover {
      color: var(--color-primary-dark);
    }
  }
}

.navbar-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover,
  &.router-link-active {
    color: var(--color-primary);
    background-color: var(--color-background-soft);
  }

  i {
    margin-right: 0.5rem;
  }
}

.nav-button {
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--color-primary-dark);
  }
}

.navbar-end {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu {
  position: relative;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;

  &:hover {
    background-color: var(--color-background-soft);
  }

  .user-name {
    color: var(--color-text);
    font-weight: 500;
  }
}

.user-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 1000;

  .dropdown-item {
    display: block;
    padding: 0.75rem 1rem;
    color: var(--color-text);
    text-decoration: none;
    transition: background-color 0.2s;
    width: 100%;
    text-align: left;
    border: none;
    background: none;
    font-size: 1rem;

    &:hover {
      background-color: var(--color-background-soft);
      color: var(--color-primary);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-border);
    }
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
    flex-wrap: wrap;
  }

  .navbar-menu {
    order: 3;
    width: 100%;
    margin-top: 1rem;
    justify-content: center;
  }

  .nav-link {
    padding: 0.5rem;
  }
}
</style> 