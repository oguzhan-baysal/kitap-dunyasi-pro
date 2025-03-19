<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const store = useStore()
const router = useRouter()

const validationSchema = yup.object({
  name: yup.string().required('İsim zorunludur'),
  email: yup.string().email('Geçerli bir e-posta adresi girin').required('E-posta zorunludur'),
  password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre zorunludur'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı zorunludur')
})

const { handleSubmit, errors } = useForm({
  validationSchema
})

const { value: name } = useField('name')
const { value: email } = useField('email')
const { value: password } = useField('password')
const { value: confirmPassword } = useField('confirmPassword')

const isLoading = ref(false)
const error = ref('')

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  error.value = ''
  
  try {
    await store.dispatch('user/register', {
      name: values.name,
      email: values.email,
      password: values.password
    })
    router.push('/books')
  } catch (err) {
    error.value = 'Kayıt olurken bir hata oluştu'
    console.error(err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="register-form">
    <h1>Kayıt Ol</h1>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div class="form-group">
      <label for="name">İsim</label>
      <input
        id="name"
        v-model="name"
        type="text"
        :class="{ error: errors.name }"
      >
      <span v-if="errors.name" class="error-text">
        {{ errors.name }}
      </span>
    </div>
    
    <div class="form-group">
      <label for="email">E-posta</label>
      <input
        id="email"
        v-model="email"
        type="email"
        :class="{ error: errors.email }"
      >
      <span v-if="errors.email" class="error-text">
        {{ errors.email }}
      </span>
    </div>
    
    <div class="form-group">
      <label for="password">Şifre</label>
      <input
        id="password"
        v-model="password"
        type="password"
        :class="{ error: errors.password }"
      >
      <span v-if="errors.password" class="error-text">
        {{ errors.password }}
      </span>
    </div>
    
    <div class="form-group">
      <label for="confirmPassword">Şifre Tekrarı</label>
      <input
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        :class="{ error: errors.confirmPassword }"
      >
      <span v-if="errors.confirmPassword" class="error-text">
        {{ errors.confirmPassword }}
      </span>
    </div>
    
    <button 
      type="submit"
      :disabled="isLoading"
      class="submit-button"
    >
      {{ isLoading ? 'Kaydediliyor...' : 'Kayıt Ol' }}
    </button>
    
    <div class="login-link">
      Zaten hesabınız var mı?
      <router-link to="/auth/login">Giriş Yap</router-link>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.register-form {
  background: var(--color-card-bg);
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h1 {
    margin: 0 0 2rem;
    text-align: center;
    font-size: 2rem;
  }
}

.error-message {
  background: var(--color-error-bg);
  color: var(--color-error);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
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
    background: var(--color-input-bg);
    color: var(--color-text);
    
    &.error {
      border-color: var(--color-error);
    }
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }
}

.error-text {
  display: block;
  margin-top: 0.5rem;
  color: var(--color-error);
  font-size: 0.875rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.login-link {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--color-text-light);
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    margin-left: 0.5rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 