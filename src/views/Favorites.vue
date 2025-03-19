<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { State } from '@/types/store';

const store = useStore<State>();
const router = useRouter();

const loading = ref(false);
const error = ref('');

const user = computed(() => store.state.user.currentUser);
const favorites = computed(() => store.getters['favorites/favoriteBooks']);
const hasFavorites = computed(() => favorites.value.length > 0);

const fetchFavorites = async () => {
  if (!user.value) {
    router.push('/auth/login');
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await store.dispatch('favorites/fetchFavorites');
  } catch (err) {
    error.value = 'Favoriler yüklenirken bir hata oluştu';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const removeFromFavorites = async (bookId: string) => {
  try {
    await store.dispatch('favorites/removeFromFavorites', bookId);
  } catch (err) {
    console.error('Favorilerden kaldırılırken bir hata oluştu:', err);
  }
};

onMounted(() => {
  fetchFavorites();
});
</script>

<template>
  <main class="favorites-page">
    <div class="favorites-container">
      <div class="favorites-header">
        <h1>Favorilerim</h1>
        <p v-if="hasFavorites" class="favorites-count">
          {{ favorites.length }} kitap
        </p>
      </div>

      <div v-if="loading" class="loading-container">
        <span class="loader"></span>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else-if="!hasFavorites" class="empty-favorites">
        <div class="empty-content">
          <h2>Henüz favori kitabınız yok</h2>
          <p>Beğendiğiniz kitapları favorilerinize ekleyerek daha sonra kolayca ulaşabilirsiniz.</p>
          <router-link to="/books" class="browse-books">
            Kitapları Keşfet
          </router-link>
        </div>
      </div>

      <div v-else class="favorites-grid">
        <div
          v-for="book in favorites"
          :key="book.id"
          class="book-card"
        >
          <button
            class="remove-favorite"
            @click="removeFromFavorites(book.id)"
            title="Favorilerden Çıkar"
          >
            ×
          </button>

          <router-link :to="`/books/${book.id}`">
            <img :src="book.coverImage" :alt="book.title">
            <div class="book-info">
              <h3>{{ book.title }}</h3>
              <p class="author">{{ book.author }}</p>
              <p class="price">{{ book.price }} TL</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.favorites-page {
  min-height: 100vh;
  padding: $spacing-4;
  background-color: var(--bg-secondary);
}

.favorites-container {
  max-width: 1200px;
  margin: 0 auto;
}

.favorites-header {
  margin-bottom: $spacing-8;
  text-align: center;

  h1 {
    font-size: $font-size-3xl;
    color: var(--text-primary);
    margin-bottom: $spacing-2;
  }

  .favorites-count {
    color: var(--text-secondary);
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: $spacing-8;

  .loader {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-color);
    border-radius: 50%;
    border-top-color: var(--primary);
    animation: spin 1s linear infinite;
  }
}

.error-message {
  padding: $spacing-4;
  background-color: rgba($error, 0.1);
  border: 1px solid var(--error);
  border-radius: $border-radius;
  color: var(--error);
  text-align: center;
}

.empty-favorites {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;

  .empty-content {
    text-align: center;
    max-width: 400px;
    padding: $spacing-8;
    background-color: var(--bg-primary);
    border-radius: $border-radius-lg;
    box-shadow: $shadow-lg;

    h2 {
      font-size: $font-size-xl;
      color: var(--text-primary);
      margin-bottom: $spacing-4;
    }

    p {
      color: var(--text-secondary);
      margin-bottom: $spacing-6;
    }

    .browse-books {
      display: inline-block;
      padding: $spacing-3 $spacing-6;
      background-color: var(--primary);
      color: white;
      text-decoration: none;
      border-radius: $border-radius;
      font-weight: $font-weight-medium;
      transition: $transition-base;

      &:hover {
        background-color: var(--primary-dark);
      }
    }
  }
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-6;
}

.book-card {
  position: relative;
  background-color: var(--bg-primary);
  border-radius: $border-radius-lg;
  overflow: hidden;
  transition: $transition-base;
  box-shadow: $shadow-md;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;

    .remove-favorite {
      opacity: 1;
    }
  }

  .remove-favorite {
    position: absolute;
    top: $spacing-2;
    right: $spacing-2;
    width: 32px;
    height: 32px;
    background-color: rgba(black, 0.6);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: $font-size-xl;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: $transition-base;
    z-index: 1;

    &:hover {
      background-color: var(--error);
    }
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  img {
    width: 100%;
    height: 280px;
    object-fit: cover;
  }

  .book-info {
    padding: $spacing-4;

    h3 {
      font-size: $font-size-lg;
      color: var(--text-primary);
      margin-bottom: $spacing-2;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .author {
      color: var(--text-secondary);
      margin-bottom: $spacing-2;
      font-size: $font-size-sm;
    }

    .price {
      color: var(--primary);
      font-weight: $font-weight-bold;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: $breakpoint-md) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  .book-card {
    img {
      height: 220px;
    }

    .remove-favorite {
      opacity: 1;
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .favorites-header {
    margin-bottom: $spacing-6;
  }
}
</style> 