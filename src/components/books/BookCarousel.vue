<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const currentSlide = ref(0)
const autoplayInterval = ref<number | null>(null)

const featuredBooks = computed(() => store.getters['books/featuredBooks'])

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % featuredBooks.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? featuredBooks.value.length - 1 
    : currentSlide.value - 1
}

const startAutoplay = () => {
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
    class="book-carousel"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div class="carousel-container">
      <div 
        class="carousel-slides"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div 
          v-for="book in featuredBooks"
          :key="book.id"
          class="carousel-slide"
        >
          <img :src="book.coverImage" :alt="book.title">
          <div class="slide-content">
            <h2>{{ book.title }}</h2>
            <p>{{ book.author }}</p>
            <router-link 
              :to="{ name: 'book-detail', params: { id: book.id }}"
              class="view-button"
            >
              İncele
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <button class="carousel-button prev" @click="prevSlide">
      &#10094;
    </button>
    <button class="carousel-button next" @click="nextSlide">
      &#10095;
    </button>

    <div class="carousel-dots">
      <button
        v-for="(_, index) in featuredBooks"
        :key="index"
        :class="{ active: currentSlide === index }"
        @click="currentSlide = index"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.book-carousel {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.carousel-container {
  width: 100%;
  height: 100%;
}

.carousel-slides {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}

.carousel-slide {
  flex: 0 0 100%;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  
  h2 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
  }
  
  p {
    margin: 0 0 1rem;
    opacity: 0.9;
  }
}

.view-button {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
  
  &:hover {
    background: var(--color-primary-dark);
  }
}

.carousel-button {
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
  transition: background 0.3s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  &.prev {
    left: 1rem;
  }
  
  &.next {
    right: 1rem;
  }
}

.carousel-dots {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  
  button {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    padding: 0;
    
    &.active {
      background: white;
    }
  }
}
</style> 