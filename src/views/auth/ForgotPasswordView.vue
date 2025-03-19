<script setup lang="ts">
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
</script>

<template>
  <div class="forgot-password-view">
    <ForgotPasswordForm />
  </div>
</template>

<style lang="scss" scoped>
.forgot-password-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
}
</style> 