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
        <i class="fab fa-twitter"></i>
        Twitter
      </button>
      <button @click="shareOnFacebook" class="facebook">
        <i class="fab fa-facebook"></i>
        Facebook
      </button>
      <button @click="shareOnWhatsapp" class="whatsapp">
        <i class="fab fa-whatsapp"></i>
        WhatsApp
      </button>
      <button @click="copyLink" class="copy">
        <i class="fas fa-link"></i>
        Bağlantıyı Kopyala
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
      color: white;
      font-weight: $font-weight-medium;
      cursor: pointer;
      transition: opacity 0.2s;

      i {
        font-size: $font-size-lg;
      }

      &:hover {
        opacity: 0.9;
      }

      &.twitter {
        background: #1da1f2;
      }

      &.facebook {
        background: #1877f2;
      }

      &.whatsapp {
        background: #25d366;
      }

      &.copy {
        background: var(--color-text);
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