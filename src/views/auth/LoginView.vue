<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'

const store = useStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = computed(() => store.state.auth.loading)
const error = computed(() => store.state.auth.error)

const handleLogin = async () => {
  try {
    await store.dispatch('auth/login', {
      email: email.value,
      password: password.value
    })
    
    // Başarılı giriş sonrası ana sayfaya yönlendir
    router.push('/')
  } catch (err) {
    console.error('Login error:', err)
  }
}
</script>

<template>
  <div class="login-view">
    <div class="login-container">
      <h1>Giriş Yap</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">E-posta</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="E-posta adresiniz"
            :disabled="loading"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Şifre</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Şifreniz"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading" class="login-button">
            {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
          </button>
          
          <div class="auth-links">
            <router-link to="/forgot-password">Şifremi Unuttum</router-link>
            <router-link to="/register">Hesap Oluştur</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 2rem;
  background-color: var(--color-background);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--color-heading);
  }
}

.login-form {
  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--color-text);
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      background: var(--color-background);
      color: var(--color-text);
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.1);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.auth-links {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;

  a {
    color: var(--color-primary);
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }
  }
}

.error-message {
  padding: 0.75rem;
  margin-bottom: 1rem;
  background: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 4px;
  color: #dc2626;
  font-size: 0.9rem;
}
</style> 