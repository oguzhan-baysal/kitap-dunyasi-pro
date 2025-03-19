<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { State } from '@/types/store';

const store = useStore<State>();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');

const validateForm = () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Şifreler eşleşmiyor';
    return false;
  }
  if (password.value.length < 8) {
    error.value = 'Şifre en az 8 karakter olmalıdır';
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (loading.value) return;
  if (!validateForm()) return;

  error.value = '';
  loading.value = true;

  try {
    await store.dispatch('user/register', {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    router.push('/');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Kayıt olurken bir hata oluştu';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main class="auth-page">
    <div class="auth-container">
      <div class="auth-content">
        <h1>Kayıt Ol</h1>
        <p class="subtitle">Kitap Dünyası Pro ailesine katılın!</p>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="name">Ad Soyad</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              placeholder="Adınız ve soyadınız"
              :disabled="loading"
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
              :disabled="loading"
            >
          </div>

          <div class="form-group">
            <label for="password">Şifre</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="En az 8 karakter"
              :disabled="loading"
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
              :disabled="loading"
            >
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button
            type="submit"
            class="submit-button"
            :class="{ loading }"
            :disabled="loading"
          >
            <span v-if="!loading">Kayıt Ol</span>
            <span v-else class="loader"></span>
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Zaten hesabınız var mı?
            <router-link to="/auth/login">Giriş Yap</router-link>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-4;
  background-color: var(--bg-secondary);
}

.auth-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.auth-content {
  background-color: var(--bg-primary);
  padding: $spacing-8;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;

  h1 {
    font-size: $font-size-3xl;
    color: var(--text-primary);
    margin-bottom: $spacing-2;
    text-align: center;
  }

  .subtitle {
    color: var(--text-secondary);
    text-align: center;
    margin-bottom: $spacing-6;
  }
}

.auth-form {
  .form-group {
    margin-bottom: $spacing-4;

    label {
      display: block;
      margin-bottom: $spacing-2;
      color: var(--text-primary);
      font-weight: $font-weight-medium;
    }

    input {
      width: 100%;
      padding: $spacing-3;
      border: 1px solid var(--border-color);
      border-radius: $border-radius;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      transition: $transition-base;

      &:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba($primary, 0.1);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }

  .error-message {
    padding: $spacing-3;
    margin-bottom: $spacing-4;
    background-color: rgba($error, 0.1);
    border: 1px solid var(--error);
    border-radius: $border-radius;
    color: var(--error);
    font-size: $font-size-sm;
  }

  .submit-button {
    width: 100%;
    padding: $spacing-3;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: $border-radius;
    font-weight: $font-weight-medium;
    transition: $transition-base;

    &:hover:not(:disabled) {
      background-color: var(--primary-dark);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &.loading {
      position: relative;
      color: transparent;
    }

    .loader {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
    }
  }
}

.auth-footer {
  margin-top: $spacing-6;
  text-align: center;
  color: var(--text-secondary);

  a {
    color: var(--primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@media (max-width: $breakpoint-md) {
  .auth-content {
    padding: $spacing-6;
  }
}
</style> 