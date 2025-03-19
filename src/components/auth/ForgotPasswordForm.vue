<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = false
    
    await store.dispatch('auth/forgotPassword', email.value)
    success.value = true
    
    // 3 saniye sonra giriş sayfasına yönlendir
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Şifre sıfırlama işlemi başarısız oldu'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="forgot-password-form">
    <h2>Şifremi Unuttum</h2>
    
    <p class="description">
      E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
    </p>
    
    <div class="form-group">
      <label for="email">E-posta</label>
      <input 
        id="email"
        type="email" 
        v-model="email"
        required
        placeholder="E-posta adresiniz"
        :disabled="success"
      >
    </div>
    
    <div class="form-actions">
      <button 
        type="submit" 
        :disabled="loading || success"
        class="submit-button"
      >
        {{ loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder' }}
      </button>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-if="success" class="success-message">
      Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. 
      Lütfen e-postanızı kontrol edin.
    </div>
    
    <div class="login-link">
      <router-link to="/login">Giriş sayfasına dön</router-link>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.forgot-password-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--color-bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h2 {
    text-align: center;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
  }
}

.description {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
    }
    
    &:disabled {
      background: var(--color-bg-secondary);
      cursor: not-allowed;
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
    
    &:hover:not(:disabled) {
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

.success-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--color-success);
  color: white;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
}

.login-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 