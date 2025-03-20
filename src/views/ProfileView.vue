<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import UserInfo from '@/components/profile/UserInfo.vue'
import UserStats from '@/components/profile/UserStats.vue'
import UserBooks from '@/components/profile/UserBooks.vue'
import UserFavorites from '@/components/profile/UserFavorites.vue'
import UserComments from '@/components/profile/UserComments.vue'

const store = useStore()
const router = useRouter()

const loading = computed(() => store.getters['auth/loading'])
const error = computed(() => store.getters['auth/error'])
const currentUser = computed(() => store.getters['auth/currentUser'])
const user = computed(() => store.getters['auth/user'])

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
    
    // Kullanıcı kitaplarını ve favorileri yükle
    store.dispatch('books/fetchUserBooks')
    store.dispatch('books/fetchUserFavorites')
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
    <div class="profile-header">
      <h1>Profilim</h1>
      <router-link to="/books/add" class="add-book-btn">
        <i class="fas fa-plus"></i>
        Yeni Kitap Ekle
      </router-link>
    </div>

    <div v-if="loading" class="loading">
      Yükleniyor...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="profile-content">
      <div class="main-section">
        <UserInfo :user="user" />
        <UserStats />
      </div>

      <UserBooks />
      <UserFavorites />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.profile-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-6;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-8;

  h1 {
    color: var(--color-heading);
    font-size: $font-size-2xl;
    margin: 0;
  }

  .add-book-btn {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    padding: $spacing-3 $spacing-6;
    background: var(--color-primary);
    color: white;
    border-radius: $border-radius;
    text-decoration: none;
    font-weight: $font-weight-medium;
    transition: background-color 0.2s;

    &:hover {
      background: var(--color-primary-dark);
    }

    i {
      font-size: $font-size-lg;
    }
  }
}

.profile-content {
  .main-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: $spacing-6;
    margin-bottom: $spacing-8;
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

@media (max-width: 1024px) {
  .profile-content {
    .main-section {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 768px) {
  .profile-view {
    padding: $spacing-4;
  }

  .profile-header {
    flex-direction: column;
    gap: $spacing-4;
    text-align: center;

    .add-book-btn {
      width: 100%;
      justify-content: center;
    }
  }
}
</style> 