<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { State } from '@/types/store';

const store = useStore<State>();
const loading = ref(true);
const featuredBooks = ref([]);

onMounted(async () => {
  try {
    await store.dispatch('books/fetchFeaturedBooks');
    featuredBooks.value = store.getters['books/getFeaturedBooks'];
  } catch (error) {
    console.error('Error fetching featured books:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>Kitap Dünyası Pro'ya Hoş Geldiniz</h1>
        <p>Binlerce kitap, tek platformda. Keşfetmeye başlayın!</p>
        <router-link to="/books" class="cta-button">
          Kitapları Keşfet
        </router-link>
      </div>
    </section>

    <section class="featured-books">
      <h2>Öne Çıkan Kitaplar</h2>
      <div v-if="loading" class="loading">
        <span class="loader"></span>
      </div>
      <div v-else class="books-grid">
        <!-- Book cards will be added here -->
      </div>
    </section>

    <section class="categories">
      <h2>Kategoriler</h2>
      <div class="categories-grid">
        <!-- Category cards will be added here -->
      </div>
    </section>

    <section class="features">
      <h2>Neden Kitap Dünyası Pro?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <i class="feature-icon">📚</i>
          <h3>Geniş Koleksiyon</h3>
          <p>Binlerce kitap arasından seçim yapın</p>
        </div>
        <div class="feature-card">
          <i class="feature-icon">🚚</i>
          <h3>Hızlı Teslimat</h3>
          <p>24 saat içinde kargoya teslim</p>
        </div>
        <div class="feature-card">
          <i class="feature-icon">💰</i>
          <h3>Uygun Fiyatlar</h3>
          <p>En iyi fiyat garantisi</p>
        </div>
        <div class="feature-card">
          <i class="feature-icon">🎁</i>
          <h3>Özel Teklifler</h3>
          <p>Üyelere özel indirimler</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.home {
  .hero {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                url('@/assets/images/hero-bg.jpg') center/cover;
    height: 60vh;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    padding: $spacing-8;

    .hero-content {
      max-width: 800px;

      h1 {
        font-size: $font-size-4xl;
        margin-bottom: $spacing-4;
      }

      p {
        font-size: $font-size-xl;
        margin-bottom: $spacing-6;
      }

      .cta-button {
        display: inline-block;
        padding: $spacing-4 $spacing-8;
        background-color: var(--primary);
        color: white;
        border-radius: $border-radius-lg;
        font-weight: $font-weight-semibold;
        transition: $transition-base;

        &:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
        }
      }
    }
  }

  section {
    padding: $spacing-12 $spacing-4;

    h2 {
      text-align: center;
      margin-bottom: $spacing-8;
    }
  }

  .books-grid,
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $spacing-6;
    padding: $spacing-4;
  }

  .features {
    background-color: var(--bg-secondary);

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: $spacing-8;
      padding: $spacing-4;

      .feature-card {
        text-align: center;
        padding: $spacing-6;
        background-color: var(--bg-primary);
        border-radius: $border-radius-lg;
        box-shadow: $shadow-md;
        transition: $transition-base;

        &:hover {
          transform: translateY(-4px);
          box-shadow: $shadow-lg;
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: $spacing-4;
        }

        h3 {
          margin-bottom: $spacing-2;
          color: var(--text-primary);
        }

        p {
          color: var(--text-secondary);
        }
      }
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;

    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid var(--primary);
      border-bottom-color: transparent;
      border-radius: 50%;
      animation: rotation 1s linear infinite;
    }
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: $breakpoint-md) {
  .home {
    .hero {
      height: 50vh;

      .hero-content {
        h1 {
          font-size: $font-size-3xl;
        }

        p {
          font-size: $font-size-lg;
        }
      }
    }

    .features-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }
}
</style> 