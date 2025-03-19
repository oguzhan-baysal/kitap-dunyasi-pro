<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import UserInfo from '@/components/profile/UserInfo.vue'
import UserBooks from '@/components/profile/UserBooks.vue'
import UserFavorites from '@/components/profile/UserFavorites.vue'
import UserComments from '@/components/profile/UserComments.vue'

const store = useStore()
const router = useRouter()

const loading = computed(() => store.getters['auth/loading'])
const error = computed(() => store.getters['auth/error'])
const currentUser = computed(() => store.getters['auth/currentUser'])

const isUpdating = ref(false)
const isChangingPassword = ref(false)

const profileForm = ref({
  name: '',
  email: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  if (currentUser.value) {
    profileForm.value.name = currentUser.value.name
    profileForm.value.email = currentUser.value.email
  }
})

const handleProfileUpdate = async () => {
  try {
    isUpdating.value = true
    await store.dispatch('auth/updateProfile', {
      name: profileForm.value.name,
      email: profileForm.value.email
    })
    alert('Profil başarıyla güncellendi')
  } catch (error) {
    console.error('Profil güncelleme hatası:', error)
  } finally {
    isUpdating.value = false
  }
}

const handlePasswordChange = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Yeni şifreler eşleşmiyor')
    return
  }

  try {
    isChangingPassword.value = true
    await store.dispatch('auth/changePassword', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    
    // Şifre değiştirme başarılı
    alert('Şifre başarıyla değiştirildi')
    
    // Form'u temizle
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error)
  } finally {
    isChangingPassword.value = false
  }
}
</script>

<template>
  <div class="profile-view">
    <h1>Profilim</h1>

    <div v-if="loading" class="loading">
      Yükleniyor...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="profile-container">
      <!-- Profil Bilgileri -->
      <div class="profile-section">
        <h2>Profil Bilgileri</h2>
        <form @submit.prevent="handleProfileUpdate" class="profile-form">
          <div class="form-group">
            <label for="name">Ad Soyad</label>
            <input
              type="text"
              id="name"
              v-model="profileForm.name"
              required
              :disabled="isUpdating"
            >
          </div>

          <div class="form-group">
            <label for="email">E-posta</label>
            <input
              type="email"
              id="email"
              v-model="profileForm.email"
              required
              :disabled="isUpdating"
            >
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="isUpdating">
              {{ isUpdating ? 'Güncelleniyor...' : 'Güncelle' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Şifre Değiştirme -->
      <div class="profile-section">
        <h2>Şifre Değiştir</h2>
        <form @submit.prevent="handlePasswordChange" class="password-form">
          <div class="form-group">
            <label for="currentPassword">Mevcut Şifre</label>
            <input
              type="password"
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              required
              :disabled="isChangingPassword"
            >
          </div>

          <div class="form-group">
            <label for="newPassword">Yeni Şifre</label>
            <input
              type="password"
              id="newPassword"
              v-model="passwordForm.newPassword"
              required
              :disabled="isChangingPassword"
            >
          </div>

          <div class="form-group">
            <label for="confirmPassword">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              required
              :disabled="isChangingPassword"
            >
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="isChangingPassword">
              {{ isChangingPassword ? 'Değiştiriliyor...' : 'Şifreyi Değiştir' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  h1 {
    color: var(--color-heading);
    margin-bottom: 2rem;
  }
}

.profile-container {
  display: grid;
  gap: 2rem;
}

.profile-section {
  background: var(--color-background-soft);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    color: var(--color-heading);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
}

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
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

.form-actions {
  margin-top: 2rem;

  button {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
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

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-text);
}

.error {
  color: var(--color-error);
  padding: 1rem;
  background: var(--color-error-bg);
  border-radius: 4px;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .profile-view {
    padding: 1rem;
  }

  .profile-section {
    padding: 1.5rem;
  }
}
</style> 