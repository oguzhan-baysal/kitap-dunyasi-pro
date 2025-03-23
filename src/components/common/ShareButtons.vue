<script setup lang="ts">
import { computed } from 'vue'
import type { Book } from '@/types/book'

const props = defineProps<{
  book: Book
}>()

const shareUrl = computed(() => window.location.href)
const shareText = computed(() => `${props.book.title} - ${props.book.author}`)

const shareOnTwitter = () => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText.value)}&url=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank')
}

const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank')
}

const shareOnWhatsapp = () => {
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText.value + ' ' + shareUrl.value)}`
  window.open(url, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    alert('Bağlantı kopyalandı!')
  } catch (err) {
    console.error('Bağlantı kopyalanırken hata oluştu:', err)
  }
}
</script>

<template>
  <div class="share-buttons">
    <h3>Paylaş</h3>
    <div class="buttons">
      <button @click="shareOnTwitter" class="twitter">
        <i class="fa-brands fa-x-twitter"></i>
      </button>
      <button @click="shareOnFacebook" class="facebook">
        <i class="fab fa-facebook"></i>
        <span>Facebook</span>
      </button>
      <button @click="shareOnWhatsapp" class="whatsapp">
        <i class="fab fa-whatsapp"></i>
        <span>WhatsApp</span>
      </button>
      <button @click="copyLink" class="copy">
        <i class="fas fa-link"></i>
        <span>Bağlantıyı Kopyala</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.share-buttons {
  margin-top: $spacing-6;

  h3 {
    font-size: $font-size-lg;
    color: var(--color-heading);
    margin-bottom: $spacing-4;
  }

  .buttons {
    display: flex;
    gap: $spacing-2;
    flex-wrap: wrap;

    button {
      display: flex;
      align-items: center;
      gap: $spacing-2;
      padding: $spacing-2 $spacing-4;
      border: none;
      border-radius: $border-radius;
      color: white !important;
      font-weight: $font-weight-medium;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
      outline: none;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          120deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent
        );
        transition: 0.5s ease;
        pointer-events: none;
      }

      i {
        font-size: $font-size-lg;
        color: white !important;
        position: relative;
        z-index: 2;
      }

      span {
        position: relative;
        z-index: 2;
        color: white !important;
      }

      &:hover, &:focus, &:active {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

        &::before {
          left: 100%;
        }
      }

      &:focus {
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
      }

      &.twitter {
        background-color: #000000 !important;
        padding: $spacing-2;
      }

      &.facebook {
        background-color: #1877f2 !important;
      }

      &.whatsapp {
        background-color: #25d366 !important;
      }

      &.copy {
        background-color: #4a5568 !important;
      }
    }
  }
}

@media (max-width: 768px) {
  .share-buttons .buttons {
    flex-direction: column;
    
    button {
      width: 100%;
      justify-content: center;
    }
  }
}
</style> 