<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { State } from '@/types/store';

const store = useStore<State>();
const router = useRouter();

const loading = ref(false);
const error = ref('');
const success = ref('');

const user = computed(() => store.state.auth.user);
const name = ref(user.value?.name || '');
const email = ref(user.value?.email || '');
const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');

const isPasswordChangeMode = ref(false);

const validatePasswordChange = () => {
  if (newPassword.value !== confirmNewPassword.value) {
    error.value = 'Yeni şifreler eşleşmiyor';
    return false;
  }
  if (newPassword.value && newPassword.value.length < 8) {
    error.value = 'Yeni şifre en az 8 karakter olmalıdır';
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (loading.value) return;

  if (isPasswordChangeMode.value && !validatePasswordChange()) return;

  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    const updateData: any = {
      name: name.value,
    };

    if (isPasswordChangeMode.value) {
      updateData.currentPassword = currentPassword.value;
      updateData.newPassword = newPassword.value;
    }

    await store.dispatch('user/updateProfile', updateData);
    success.value = 'Profil başarıyla güncellendi';

    if (isPasswordChangeMode.value) {
      currentPassword.value = '';
      newPassword.value = '';
      confirmNewPassword.value = '';
      isPasswordChangeMode.value = false;
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Profil güncellenirken bir hata oluştu';
  } finally {
    loading.value = false;
  }
};

const handleLogout = async () => {
  try {
    await store.dispatch('user/logout');
    router.push('/auth/login');
  } catch (err) {
    error.value = 'Çıkış yapılırken bir hata oluştu';
  }
};

onMounted(() => {
  if (!user.value) {
    router.push('/auth/login');
  }
});
</script>

<template>
  <main class="profile-page">
    <div class="profile-container">
      <div class="profile-content">
        <h1>Profil Ayarları</h1>

        <form @submit.prevent="handleSubmit" class="profile-form">
          <div class="form-group">
            <label for="name">Ad Soyad</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              placeholder="Adınız ve soyadınız"
              :disabled="loading"
            >
          </div>

          <div class="form-group">
            <label for="email">E-posta</label>
            <input
              id="email"
              v-model="email"
              type="email"
              disabled
              placeholder="E-posta adresiniz"
            >
            <small>E-posta adresi değiştirilemez</small>
          </div>

          <div class="password-section">
            <button
              type="button"
              class="toggle-password-button"
              @click="isPasswordChangeMode = !isPasswordChangeMode"
            >
              {{ isPasswordChangeMode ? 'Şifre değiştirmekten vazgeç' : 'Şifreyi değiştir' }}
            </button>

            <template v-if="isPasswordChangeMode">
              <div class="form-group">
                <label for="current-password">Mevcut Şifre</label>
                <input
                  id="current-password"
                  v-model="currentPassword"
                  type="password"
                  required
                  placeholder="Mevcut şifreniz"
                  :disabled="loading"
                >
              </div>

              <div class="form-group">
                <label for="new-password">Yeni Şifre</label>
                <input
                  id="new-password"
                  v-model="newPassword"
                  type="password"
                  required
                  placeholder="En az 8 karakter"
                  :disabled="loading"
                >
              </div>

              <div class="form-group">
                <label for="confirm-new-password">Yeni Şifre Tekrar</label>
                <input
                  id="confirm-new-password"
                  v-model="confirmNewPassword"
                  type="password"
                  required
                  placeholder="Yeni şifrenizi tekrar girin"
                  :disabled="loading"
                >
              </div>
            </template>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div v-if="success" class="success-message">
            {{ success }}
          </div>

          <button
            type="submit"
            class="submit-button"
            :class="{ loading }"
            :disabled="loading"
          >
            <span v-if="!loading">Değişiklikleri Kaydet</span>
            <span v-else class="loader"></span>
          </button>

          <button
            type="button"
            class="logout-button"
            @click="handleLogout"
          >
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  padding: $spacing-4;
  background-color: var(--bg-secondary);
}

.profile-container {
  width: 100%;
  max-width: 600px;
  margin: $spacing-8 auto;
}

.profile-content {
  background-color: var(--bg-primary);
  padding: $spacing-8;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;

  h1 {
    font-size: $font-size-3xl;
    color: var(--text-primary);
    margin-bottom: $spacing-6;
    text-align: center;
  }
}

.profile-form {
  .form-group {
    margin-bottom: $spacing-4;

    label {
      display: block;
      margin-bottom: $spacing-2;
      color: var(--text-primary);
      font-weight: $font-weight-medium;
    }

    input {
      width: 100%;
      padding: $spacing-3;
      border: 1px solid var(--border-color);
      border-radius: $border-radius;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      transition: $transition-base;

      &:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba($primary, 0.1);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    small {
      display: block;
      margin-top: $spacing-1;
      color: var(--text-secondary);
      font-size: $font-size-sm;
    }
  }

  .password-section {
    margin: $spacing-6 0;
    padding-top: $spacing-4;
    border-top: 1px solid var(--border-color);
  }

  .toggle-password-button {
    background: none;
    border: none;
    color: var(--primary);
    font-size: $font-size-sm;
    cursor: pointer;
    padding: 0;
    margin-bottom: $spacing-4;

    &:hover {
      text-decoration: underline;
    }
  }

  .error-message {
    padding: $spacing-3;
    margin-bottom: $spacing-4;
    background-color: rgba($error, 0.1);
    border: 1px solid var(--error);
    border-radius: $border-radius;
    color: var(--error);
    font-size: $font-size-sm;
  }

  .success-message {
    padding: $spacing-3;
    margin-bottom: $spacing-4;
    background-color: rgba($success, 0.1);
    border: 1px solid var(--success);
    border-radius: $border-radius;
    color: var(--success);
    font-size: $font-size-sm;
  }

  .submit-button {
    width: 100%;
    padding: $spacing-3;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: $border-radius;
    font-weight: $font-weight-medium;
    transition: $transition-base;
    margin-bottom: $spacing-4;

    &:hover:not(:disabled) {
      background-color: var(--primary-dark);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &.loading {
      position: relative;
      color: transparent;
    }

    .loader {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
    }
  }

  .logout-button {
    width: 100%;
    padding: $spacing-3;
    background-color: transparent;
    color: var(--error);
    border: 1px solid var(--error);
    border-radius: $border-radius;
    font-weight: $font-weight-medium;
    transition: $transition-base;

    &:hover {
      background-color: var(--error);
      color: white;
    }
  }
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@media (max-width: $breakpoint-md) {
  .profile-content {
    padding: $spacing-6;
  }

  .profile-container {
    margin: $spacing-4 auto;
  }
}
</style> 