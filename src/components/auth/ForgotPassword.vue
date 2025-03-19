<script setup lang="ts">
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().required('E-posta adresi zorunludur').email('Geçerli bir e-posta adresi girin')
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema
})

const { value: email } = useField('email')

const isLoading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // Simülasyon: 1 saniye bekle
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Başarılı senaryoyu simüle et
    isSuccess.value = true
    
  } catch (error) {
    errorMessage.value = 'İşlem başarısız. Lütfen daha sonra tekrar deneyin.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="forgot-password-form">
    <h2>Şifremi Unuttum</h2>
    
    <div v-if="isSuccess" class="success-message">
      <div class="icon">✓</div>
      <h3>E-posta Gönderildi</h3>
      <p>
        Şifre sıfırlama talimatları e-posta adresinize gönderildi.
        Lütfen gelen kutunuzu kontrol edin.
      </p>
      <router-link to="/login" class="back-to-login">
        Giriş sayfasına dön
      </router-link>
    </div>
    
    <form v-else @submit.prevent="onSubmit" class="form">
      <p class="form-description">
        E-posta adresinizi girin. Size şifrenizi sıfırlamanız için bir bağlantı göndereceğiz.
      </p>
      
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

      <div class="form-actions">
        <router-link to="/login" class="cancel-link">
          Vazgeç
        </router-link>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Gönderiliyor...</span>
          <span v-else>Şifremi Sıfırla</span>
        </button>
      </div>

      <div v-if="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.forgot-password-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--color-card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--color-text-primary);
  }
}

.form-description {
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
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
  margin-top: 1rem;
}

.cancel-link {
  color: var(--color-text-secondary);
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

.success-message {
  text-align: center;
  padding: 2rem 1rem;

  .icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 1rem;
    background: var(--color-success);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  h3 {
    color: var(--color-success);
    margin-bottom: 1rem;
  }

  p {
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .back-to-login {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style> 