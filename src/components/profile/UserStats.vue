<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()

const stats = computed(() => ({
  totalBooks: store.getters['books/userBooks']?.length || 0,
  favorites: store.getters['books/userFavorites']?.length || 0,
  totalComments: store.getters['comments/userComments']?.length || 0,
  averageRating: calculateAverageRating()
}))

function calculateAverageRating() {
  const userBooks = store.getters['books/userBooks'] || []
  if (userBooks.length === 0) return 0
  
  const totalRating = userBooks.reduce((sum, book) => sum + (book.rating || 0), 0)
  return (totalRating / userBooks.length).toFixed(1)
}
</script>

<template>
  <div class="user-stats">
    <h2>İstatistikler</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <i class="fas fa-book"></i>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalBooks }}</span>
          <span class="stat-label">Kitap</span>
        </div>
      </div>

      <div class="stat-card">
        <i class="fas fa-heart"></i>
        <div class="stat-info">
          <span class="stat-value">{{ stats.favorites }}</span>
          <span class="stat-label">Favori</span>
        </div>
      </div>

      <div class="stat-card">
        <i class="fas fa-comment"></i>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalComments }}</span>
          <span class="stat-label">Yorum</span>
        </div>
      </div>

      <div class="stat-card">
        <i class="fas fa-star"></i>
        <div class="stat-info">
          <span class="stat-value">{{ stats.averageRating }}</span>
          <span class="stat-label">Ortalama Puan</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.user-stats {
  background: var(--color-background-soft);
  padding: $spacing-6;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;

  h2 {
    color: var(--color-heading);
    margin-bottom: $spacing-6;
    font-size: $font-size-xl;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-4;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  padding: $spacing-4;
  background: var(--color-background);
  border-radius: $border-radius;
  box-shadow: $shadow-sm;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  i {
    font-size: $font-size-2xl;
    color: var(--color-primary);
  }

  .stat-info {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: var(--color-heading);
  }

  .stat-label {
    font-size: $font-size-sm;
    color: var(--color-text-light);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> 