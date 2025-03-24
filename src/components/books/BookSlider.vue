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

  @media (max-width: $breakpoint-sm) {
    margin: 1rem 0;
  }
}

.slider-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: $border-radius-lg;
  background: var(--color-background-soft);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: $breakpoint-sm) {
    height: 550px;
  }
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
  overflow: hidden;

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
  background: linear-gradient(90deg, var(--color-background-soft) 0%, transparent 100%);

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    padding: $spacing-4;
    gap: $spacing-4;
    justify-content: flex-start;
    text-align: center;
    background: linear-gradient(0deg, var(--color-background-soft) 0%, transparent 100%);
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  img {
    width: 250px;
    height: 350px;
    object-fit: cover;
    border-radius: $border-radius;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    @media (max-width: $breakpoint-sm) {
      width: 160px;
      height: 240px;
      margin-top: $spacing-4;
      margin-bottom: $spacing-4;
      flex-shrink: 0;
    }
  }

  .book-info {
    flex: 1;
    max-width: 600px;
    
    @media (max-width: $breakpoint-sm) {
      max-width: 100%;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    h2 {
      font-size: $font-size-3xl;
      color: var(--color-heading);
      margin-bottom: $spacing-4;

      @media (max-width: $breakpoint-sm) {
        font-size: $font-size-xl;
        margin-bottom: $spacing-3;
        padding: 0 $spacing-2;
      }
    }

    .author {
      font-size: $font-size-lg;
      color: var(--color-text-light);
      margin-bottom: $spacing-3;

      @media (max-width: $breakpoint-sm) {
        font-size: $font-size-base;
        margin-bottom: $spacing-3;
      }
    }

    .description {
      font-size: $font-size-base;
      color: var(--color-text);
      margin-bottom: $spacing-6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;

      @media (max-width: $breakpoint-sm) {
        font-size: $font-size-base;
        margin-bottom: $spacing-4;
        -webkit-line-clamp: 3;
        line-height: 1.5;
        padding: 0 $spacing-3;
        max-width: 100%;
      }
    }

    .details-button {
      display: inline-block;
      padding: $spacing-3 $spacing-6;
      background-color: var(--color-primary);
      color: white;
      border-radius: $border-radius;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;

      @media (max-width: $breakpoint-sm) {
        padding: $spacing-3 $spacing-8;
        font-size: $font-size-base;
        width: auto;
        min-width: 200px;
        margin-bottom: $spacing-4;
      }

      &:hover {
        background-color: var(--color-primary-dark);
        transform: translateY(-1px);
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
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  @media (max-width: $breakpoint-sm) {
    width: 32px;
    height: 32px;
    font-size: 1.25rem;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  &.prev {
    left: $spacing-4;

    @media (max-width: $breakpoint-sm) {
      left: $spacing-2;
    }
  }

  &.next {
    right: $spacing-4;

    @media (max-width: $breakpoint-sm) {
      right: $spacing-2;
    }
  }
}

.slider-dots {
  display: flex;
  justify-content: center;
  gap: $spacing-2;
  margin-top: $spacing-4;

  @media (max-width: $breakpoint-sm) {
    margin-top: $spacing-2;
    gap: $spacing-1;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-border);
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    @media (max-width: $breakpoint-sm) {
      width: 8px;
      height: 8px;
    }

    &.active {
      background: var(--color-primary);
      transform: scale(1.2);
    }

    &:hover {
      background: var(--color-primary-light);
    }
  }
}
</style> 