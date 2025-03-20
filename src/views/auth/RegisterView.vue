<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Lütfen tüm alanları doldurun'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Şifreler eşleşmiyor'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await store.dispatch('auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Kayıt olurken bir hata oluştu'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-view">
    <div class="register-container">
      <h1>Kayıt Ol</h1>
      
      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-group">
          <label for="name">Ad Soyad</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            placeholder="Adınız ve soyadınız"
          >
        </div>

        <div class="form-group">
          <label for="email">E-posta</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="E-posta adresiniz"
          >
        </div>

        <div class="form-group">
          <label for="password">Şifre</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Şifreniz"
          >
        </div>

        <div class="form-group">
          <label for="confirm-password">Şifre Tekrar</label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="Şifrenizi tekrar girin"
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="loading"
        >
          {{ loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol' }}
        </button>

        <div class="form-footer">
          <router-link to="/login" class="login-link">
            Zaten hesabınız var mı? Giriş yapın
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.register-view {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-6;
}

.register-container {
  background: var(--color-background-soft);
  padding: $spacing-8;
  border-radius: $border-radius-lg;
  width: 100%;
  max-width: 400px;
  box-shadow: $shadow-md;

  h1 {
    text-align: center;
    color: var(--color-heading);
    margin-bottom: $spacing-6;
    font-size: $font-size-2xl;
  }
}

.register-form {
  .form-group {
    margin-bottom: $spacing-4;

    label {
      display: block;
      margin-bottom: $spacing-2;
      color: var(--color-text);
      font-weight: $font-weight-medium;
    }

    input {
      width: 100%;
      padding: $spacing-3;
      border: 1px solid var(--color-border);
      border-radius: $border-radius;
      background: var(--color-background);
      color: var(--color-text);
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }
  }

  .error-message {
    color: var(--color-error);
    margin-bottom: $spacing-4;
    font-size: $font-size-sm;
    text-align: center;
  }

  .submit-button {
    width: 100%;
    padding: $spacing-3;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: $border-radius;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .form-footer {
    margin-top: $spacing-6;
    text-align: center;

    a {
      color: var(--color-primary);
      text-decoration: none;
      font-size: $font-size-sm;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

@media (max-width: 768px) {
  .register-view {
    padding: $spacing-4;
  }

  .register-container {
    padding: $spacing-6;
  }
}
</style> 