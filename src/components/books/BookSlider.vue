<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from '@/store'
import type { Book } from '@/types/book'

const store = useStore()
const currentSlide = ref(0)
const autoplayInterval = ref<number | null>(null)

const featuredBooks = computed(() => {
  const allBooks = store.getters['books/allBooks']
  return allBooks.slice(0, 5) // İlk 5 kitabı öne çıkan olarak göster
})

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % featuredBooks.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? featuredBooks.value.length - 1 
    : currentSlide.value - 1
}

const startAutoplay = () => {
  stopAutoplay()
  autoplayInterval.value = window.setInterval(nextSlide, 5000)
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<template>
  <div 
    class="book-slider"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div class="slider-container">
      <button class="nav-button prev" @click="prevSlide">
        &#10094;
      </button>

      <div class="slides">
        <div 
          v-for="(book, index) in featuredBooks" 
          :key="book.id"
          class="slide"
          :class="{ active: index === currentSlide }"
        >
          <div class="slide-content">
            <img :src="book.coverImage" :alt="book.title">
            <div class="book-info">
              <h2>{{ book.title }}</h2>
              <p class="author">{{ book.author }}</p>
              <p class="description">{{ book.description }}</p>
              <router-link 
                :to="'/books/' + book.id"
                class="details-button"
              >
                Detayları Gör
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <button class="nav-button next" @click="nextSlide">
        &#10095;
      </button>
    </div>

    <div class="slider-dots">
      <button
        v-for="(_, index) in featuredBooks"
        :key="index"
        class="dot"
        :class="{ active: index === currentSlide }"
        @click="currentSlide = index"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.book-slider {
  width: 100%;
  margin: 2rem 0;
  position: relative;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: $border-radius-lg;
  background: var(--bg-primary);
  box-shadow: $shadow-lg;
}

.slides {
  width: 100%;
  height: 100%;
  position: relative;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;

  &.active {
    opacity: 1;
  }
}

.slide-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: $spacing-6;
  gap: $spacing-8;

  img {
    width: 250px;
    height: 350px;
    object-fit: cover;
    border-radius: $border-radius;
    box-shadow: $shadow-md;
  }

  .book-info {
    flex: 1;
    
    h2 {
      font-size: $font-size-3xl;
      color: var(--color-heading);
      margin-bottom: $spacing-4;
    }

    .author {
      font-size: $font-size-lg;
      color: var(--color-text-light);
      margin-bottom: $spacing-3;
    }

    .description {
      font-size: $font-size-base;
      color: var(--color-text);
      margin-bottom: $spacing-6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .details-button {
      display: inline-block;
      padding: $spacing-3 $spacing-6;
      background-color: var(--color-primary);
      color: white;
      border-radius: $border-radius;
      text-decoration: none;
      font-weight: $font-weight-medium;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--color-primary-dark);
      }
    }
  }
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  &.prev {
    left: $spacing-4;
  }

  &.next {
    right: $spacing-4;
  }
}

.slider-dots {
  display: flex;
  justify-content: center;
  gap: $spacing-2;
  margin-top: $spacing-4;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-border);
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;

    &.active {
      background: var(--color-primary);
    }

    &:hover {
      background: var(--color-primary-light);
    }
  }
}

@media (max-width: 768px) {
  .slider-container {
    height: auto;
  }

  .slide-content {
    flex-direction: column;
    padding: $spacing-4;
    gap: $spacing-4;

    img {
      width: 200px;
      height: 280px;
    }

    .book-info {
      text-align: center;

      h2 {
        font-size: $font-size-2xl;
      }

      .description {
        -webkit-line-clamp: 2;
      }
    }
  }
}
</style> 