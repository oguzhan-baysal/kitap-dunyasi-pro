<script setup lang="ts">
import { ref } from 'vue'
import type { Book } from '@/types/book'

const props = defineProps<{
  book: Book
}>()

const review = ref('')
const rating = ref(5)
const isSubmitting = ref(false)

const submitReview = async () => {
  if (!review.value.trim()) return

  try {
    isSubmitting.value = true
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Başarılı
    review.value = ''
    rating.value = 5
    alert('İncelemeniz başarıyla gönderildi!')
  } catch (error) {
    console.error('İnceleme gönderilirken hata:', error)
    alert('İnceleme gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="book-review">
    <h2>İnceleme Yaz</h2>
    
    <form @submit.prevent="submitReview" class="review-form">
      <div class="form-group">
        <label for="rating" class="rating-label">Puanınız:</label>
        <div class="rating-input">
          <select v-model="rating" id="rating" class="rating-select">
            <option value="5" selected>5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="review">İncelemeniz:</label>
        <textarea
          v-model="review"
          id="review"
          rows="6"
          placeholder="Bu kitap hakkında detaylı düşüncelerinizi paylaşın..."
          :disabled="isSubmitting"
        ></textarea>
      </div>

      <button 
        type="submit" 
        :disabled="isSubmitting || !review.trim()"
      >
        {{ isSubmitting ? 'Gönderiliyor...' : 'İnceleme Gönder' }}
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.book-review {
  background: var(--color-background-soft);
  padding: $spacing-6;
  border-radius: $border-radius;

  h2 {
    margin-bottom: $spacing-6;
    color: var(--color-heading);
  }
}

.review-form {
  .form-group {
    margin-bottom: $spacing-4;

    .rating-label {
      display: block;
      margin-bottom: $spacing-2;
      color: #000000 !important;
      font-weight: $font-weight-medium;
    }

    label {
      display: block;
      margin-bottom: $spacing-2;
      color: var(--color-text);
      font-weight: $font-weight-medium;
    }

    .rating-input {
      display: flex;
      align-items: center;
      gap: $spacing-4;

      .rating-select {
        padding: 0.25rem;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        background: var(--color-background);
        color: #000000 !important;
        width: 45px;
        text-align: center;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 4px center;
        background-size: 12px;
        padding-right: 20px;
        background-color: #ffffff;

        &:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      }
    }

    textarea {
      width: 100%;
      padding: $spacing-3;
      border: 1px solid var(--color-border);
      border-radius: $border-radius;
      background: var(--color-background);
      color: var(--color-text);
      font-family: inherit;
      resize: vertical;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }

  button {
    width: 100%;
    padding: $spacing-3;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: $border-radius;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

@media (max-width: 768px) {
  .book-review {
    padding: $spacing-4;
  }

  .rating-input {
    flex-direction: column;
    align-items: flex-start !important;
    gap: $spacing-2 !important;
  }
}
</style> 