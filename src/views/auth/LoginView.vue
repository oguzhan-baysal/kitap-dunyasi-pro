<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleSubmit = async (e?: Event) => {
  if (e) {
    e.preventDefault()
  }
  
  console.log('Form submit başladı')

  if (!email.value || !password.value) {
    error.value = 'Lütfen tüm alanları doldurun'
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log('Login isteği gönderiliyor:', { email: email.value })
    await store.dispatch('auth/login', {
      email: email.value,
      password: password.value
    })
    
    // Login başarılı olduğunda
    const isLoggedIn = store.getters['auth/isLoggedIn']
    console.log('Kimlik doğrulama durumu:', isLoggedIn)
    
    if (isLoggedIn) {
      console.log('Yönlendirme yapılıyor...')
      await router.push('/')
    } else {
      error.value = 'Giriş başarısız oldu'
    }
  } catch (err) {
    console.error('Login hatası:', err)
    error.value = err instanceof Error ? err.message : 'Giriş yapılırken bir hata oluştu'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-view">
    <div class="login-container">
      <h1>Giriş Yap</h1>
      
      <form @submit.prevent="handleSubmit" class="login-form">
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

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="loading"
          @click="handleSubmit"
        >
          {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
        </button>

        <div class="form-footer">
          <router-link to="/forgot-password" class="forgot-password">
            Şifremi Unuttum
          </router-link>
          <router-link to="/register" class="register-link">
            Hesabınız yok mu? Kayıt olun
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.login-view {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-6;
}

.login-container {
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

.login-form {
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
    display: flex;
    flex-direction: column;
    gap: $spacing-2;

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
  .login-view {
    padding: $spacing-4;
  }

  .login-container {
    padding: $spacing-6;
  }
}
</style> 