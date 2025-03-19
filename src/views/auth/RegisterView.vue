<script setup lang="ts">
import RegisterForm from '@/components/auth/RegisterForm.vue'
</script>

<template>
  <div class="register-view">
    <RegisterForm />
  </div>
</template>

<style lang="scss" scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
}
</style> 