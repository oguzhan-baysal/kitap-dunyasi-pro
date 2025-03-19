<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const store = useStore()
const router = useRouter()

const schema = yup.object({
  email: yup.string().required('E-posta adresi zorunludur').email('Geçerli bir e-posta adresi girin'),
  password: yup.string().required('Şifre zorunludur').min(6, 'Şifre en az 6 karakter olmalıdır')
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema
})

const { value: email } = useField('email')
const { value: password } = useField('password')

const isLoading = ref(false)
const errorMessage = ref('')

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    await store.dispatch('auth/login', {
      email: values.email,
      password: values.password
    })
    
    router.push('/') 
  } catch (error) {
    errorMessage.value = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="login-form">
    <h2>Giriş Yap</h2>
    
    <form @submit.prevent="onSubmit" class="form">
      <div class="form-group">
        <label for="email">E-posta</label>
        <input
          id="email"
          v-model="email"
          type="email"
          :class="{ 'has-error': errors.email }"
          placeholder="E-posta adresiniz"
          autocomplete="email"
        >
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password">Şifre</label>
        <input
          id="password"
          v-model="password"
          type="password"
          :class="{ 'has-error': errors.password }"
          placeholder="Şifreniz"
          autocomplete="current-password"
        >
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <div class="form-actions">
        <router-link to="/forgot-password" class="forgot-password">
          Şifremi Unuttum
        </router-link>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Giriş yapılıyor...</span>
          <span v-else>Giriş Yap</span>
        </button>
      </div>

      <div v-if="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>

      <div class="register-link">
        Hesabınız yok mu? 
        <router-link to="/register">Kayıt Ol</router-link>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--color-card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--color-text-primary);
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: var(--color-text-primary);
  }

  input {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    &.has-error {
      border-color: var(--color-error);
    }
  }
}

.error-message {
  color: var(--color-error);
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
  }
}

.submit-button {
  padding: 0.75rem 2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.error-alert {
  padding: 0.75rem;
  background: var(--color-error-bg);
  color: var(--color-error);
  border-radius: 4px;
  text-align: center;
}

.register-link {
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);

  a {
    color: var(--color-primary);
    text-decoration: none;
    margin-left: 0.25rem;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 