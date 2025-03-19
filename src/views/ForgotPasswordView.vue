<template>
  <div class="forgot-password-view">
    <ForgotPassword />
  </div>
</template>

<script setup lang="ts">
import ForgotPassword from '@/components/auth/ForgotPassword.vue'
</script>

<style lang="scss" scoped>
.forgot-password-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--color-background);
}
</style> 