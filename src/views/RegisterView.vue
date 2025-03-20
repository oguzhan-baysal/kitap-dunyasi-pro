<template>
  <div class="register-view">
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '@/components/auth/RegisterForm.vue'
</script>

<style lang="scss" scoped>
.register-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background-color: var(--color-background);
}
</style> 