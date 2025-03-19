<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue'
</script>

<template>
  <div class="login-view">
    <LoginForm />
  </div>
</template>

<style lang="scss" scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--color-background);
}
</style> 