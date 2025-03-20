<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  try {
    if (password.value !== confirmPassword.value) {
      error.value = 'Şifreler eşleşmiyor'
      return
    }

    loading.value = true
    error.value = ''
    
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
  <form @submit.prevent="handleSubmit" class="register-form">
    <h2>Kayıt Ol</h2>
    
    <div class="form-group">
      <label for="name">Ad Soyad</label>
      <input 
        id="name"
        type="text" 
        v-model="name"
        required
        placeholder="Adınız ve soyadınız"
      >
    </div>
    
    <div class="form-group">
      <label for="email">E-posta</label>
      <input 
        id="email"
        type="email" 
        v-model="email"
        required
        placeholder="E-posta adresiniz"
      >
    </div>
    
    <div class="form-group">
      <label for="password">Şifre</label>
      <input 
        id="password"
        type="password" 
        v-model="password"
        required
        placeholder="Şifreniz"
      >
    </div>
    
    <div class="form-group">
      <label for="confirmPassword">Şifre Tekrar</label>
      <input 
        id="confirmPassword"
        type="password" 
        v-model="confirmPassword"
        required
        placeholder="Şifrenizi tekrar girin"
      >
    </div>
    
    <div class="form-actions">
      <button 
        type="submit" 
        :disabled="loading"
        class="submit-button"
      >
        {{ loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol' }}
      </button>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div class="login-link">
      Zaten hesabınız var mı? 
      <router-link to="/login">Giriş Yap</router-link>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.register-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--color-heading);
  }
}

.form-group {
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 1rem;
    background: var(--color-background);
    color: var(--color-text);
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
    }

    &::placeholder {
      color: var(--color-text-light);
    }
  }
}

.form-actions {
  margin-bottom: 1rem;
  
  .submit-button {
    width: 100%;
    padding: 0.75rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
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
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--color-error);
  color: white;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
}

.login-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-light);
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 