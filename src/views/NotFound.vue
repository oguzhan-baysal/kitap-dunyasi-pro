<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Aradığınız sayfa bulunamadı</p>
    <router-link to="/" class="home-link">
      Ana Sayfaya Dön
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
  
  h1 {
    font-size: 6rem;
    margin: 0;
    color: var(--color-primary);
  }
  
  p {
    font-size: 1.5rem;
    margin: 1rem 0 2rem;
    color: var(--color-text-light);
  }
}

.home-link {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
  
  &:hover {
    background: var(--color-primary-dark);
  }
}
</style> 