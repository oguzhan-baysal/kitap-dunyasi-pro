<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const store = useStore()

const schema = yup.object({
  name: yup.string().required('İsim zorunludur'),
  email: yup.string().required('E-posta zorunludur').email('Geçerli bir e-posta girin'),
  currentPassword: yup.string().when('newPassword', {
    is: (value: string) => value && value.length > 0,
    then: () => yup.string().required('Mevcut şifre zorunludur')
  }),
  newPassword: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  confirmPassword: yup.string().when('newPassword', {
    is: (value: string) => value && value.length > 0,
    then: () => yup.string()
      .required('Şifre tekrarı zorunludur')
      .oneOf([yup.ref('newPassword')], 'Şifreler eşleşmiyor')
  })
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    name: store.state.auth.user?.name || '',
    email: store.state.auth.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
})

const { value: name } = useField('name')
const { value: email } = useField('email')
const { value: currentPassword } = useField('currentPassword')
const { value: newPassword } = useField('newPassword')
const { value: confirmPassword } = useField('confirmPassword')

const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const isPasswordChangeAttempted = computed(() => 
  newPassword.value || currentPassword.value || confirmPassword.value
)

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // Profil güncelleme işlemi
    await store.dispatch('auth/updateProfile', {
      name: values.name,
      email: values.email,
      ...(isPasswordChangeAttempted.value && {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      })
    })

    successMessage.value = 'Profil bilgileriniz başarıyla güncellendi'
    
    // Şifre alanlarını temizle
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

  } catch (error) {
    errorMessage.value = 'Profil güncellenirken bir hata oluştu'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="user-info">
    <h2>Profil Bilgileri</h2>

    <form @submit.prevent="onSubmit" class="form">
      <div class="form-section">
        <h3>Kişisel Bilgiler</h3>
        
        <div class="form-group">
          <label for="name">İsim</label>
          <input
            id="name"
            v-model="name"
            type="text"
            :class="{ 'has-error': errors.name }"
            placeholder="Adınız"
          >
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">E-posta</label>
          <input
            id="email"
            v-model="email"
            type="email"
            :class="{ 'has-error': errors.email }"
            placeholder="E-posta adresiniz"
          >
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>
      </div>

      <div class="form-section">
        <h3>Şifre Değiştir</h3>
        <p class="section-description">Şifrenizi değiştirmek istemiyorsanız bu alanları boş bırakın.</p>

        <div class="form-group">
          <label for="currentPassword">Mevcut Şifre</label>
          <input
            id="currentPassword"
            v-model="currentPassword"
            type="password"
            :class="{ 'has-error': errors.currentPassword }"
            placeholder="Mevcut şifreniz"
          >
          <span v-if="errors.currentPassword" class="error-message">
            {{ errors.currentPassword }}
          </span>
        </div>

        <div class="form-group">
          <label for="newPassword">Yeni Şifre</label>
          <input
            id="newPassword"
            v-model="newPassword"
            type="password"
            :class="{ 'has-error': errors.newPassword }"
            placeholder="Yeni şifreniz"
          >
          <span v-if="errors.newPassword" class="error-message">
            {{ errors.newPassword }}
          </span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Yeni Şifre Tekrar</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            :class="{ 'has-error': errors.confirmPassword }"
            placeholder="Yeni şifrenizi tekrar girin"
          >
          <span v-if="errors.confirmPassword" class="error-message">
            {{ errors.confirmPassword }}
          </span>
        </div>
      </div>

      <div v-if="successMessage" class="success-alert">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>

      <div class="form-actions">
        <button 
          type="submit" 
          class="submit-button"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Güncelleniyor...</span>
          <span v-else>Değişiklikleri Kaydet</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.user-info {
  max-width: 600px;
  margin: 0 auto;
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
  gap: 2rem;
}

.form-section {
  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
  }

  .section-description {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;

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

.success-alert {
  padding: 1rem;
  background: var(--color-success-bg);
  color: var(--color-success);
  border-radius: 4px;
  text-align: center;
  margin-bottom: 1rem;
}

.error-alert {
  padding: 1rem;
  background: var(--color-error-bg);
  color: var(--color-error);
  border-radius: 4px;
  text-align: center;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
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
</style> 