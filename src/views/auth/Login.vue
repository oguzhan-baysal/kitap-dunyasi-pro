<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { State } from '@/types/store';

const store = useStore<State>();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  if (loading.value) return;

  error.value = '';
  loading.value = true;

  try {
    await store.dispatch('user/login', {
      email: email.value,
      password: password.value,
    });

    const redirectPath = route.query.redirect as string || '/';
    router.push(redirectPath);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Giriş yapılırken bir hata oluştu';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main class="auth-page">
    <div class="auth-container">
      <div class="auth-content">
        <h1>Giriş Yap</h1>
        <p class="subtitle">Kitap Dünyası Pro'ya hoş geldiniz!</p>

        <form @submit.prevent="handleSubmit" class="auth-form">
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
              placeholder="Şifreniz"
              :disabled="loading"
            >
          </div>

          <div class="form-actions">
            <router-link to="/auth/forgot-password" class="forgot-password">
              Şifremi Unuttum
            </router-link>
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
            <span v-if="!loading">Giriş Yap</span>
            <span v-else class="loader"></span>
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Hesabınız yok mu?
            <router-link to="/auth/register">Kayıt Ol</router-link>
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

  .form-actions {
    text-align: right;
    margin-bottom: $spacing-4;

    .forgot-password {
      color: var(--primary);
      font-size: $font-size-sm;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
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