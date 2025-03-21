<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import type { Book } from '@/types'

const props = defineProps<{
  book: Book
}>()

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

const store = useStore()
const newReview = ref({
  rating: 5,
  comment: ''
})

const reviews = ref<Review[]>([
  {
    id: '1',
    userId: '1',
    userName: 'Ahmet Yılmaz',
    rating: 5,
    comment: 'Harika bir kitap, kesinlikle tavsiye ederim.',
    createdAt: '2024-03-15'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Ayşe Demir',
    rating: 4,
    comment: 'Güzel bir kitap ama bazı kısımlar biraz sıkıcıydı.',
    createdAt: '2024-03-14'
  }
])

const submitReview = () => {
  if (!store.getters['auth/isAuthenticated']) {
    // TODO: Login sayfasına yönlendir
    return
  }

  const review: Review = {
    id: Date.now().toString(),
    userId: store.getters['auth/currentUser'].id,
    userName: store.getters['auth/currentUser'].name,
    rating: newReview.value.rating,
    comment: newReview.value.comment,
    createdAt: new Date().toISOString().split('T')[0]
  }

  reviews.value.unshift(review)
  newReview.value = {
    rating: 5,
    comment: ''
  }
}

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return (sum / reviews.value.length).toFixed(1)
})
</script>

<template>
  <div class="book-reviews">
    <h2 class="book-reviews__title">Değerlendirmeler</h2>
    
    <div class="book-reviews__stats">
      <div class="rating">
        <span class="rating__score">{{ averageRating }}</span>
        <div class="rating__stars">
          <i v-for="i in 5" :key="i" class="fas" 
             :class="i <= Math.round(Number(averageRating)) ? 'fa-star' : 'fa-star-o'">
          </i>
        </div>
        <span class="rating__count">({{ reviews.length }} değerlendirme)</span>
      </div>
    </div>

    <form @submit.prevent="submitReview" class="review-form">
      <div class="review-form__rating">
        <span>Puanınız:</span>
        <div class="stars">
          <i v-for="i in 5" :key="i" class="fas" 
             :class="i <= newReview.rating ? 'fa-star' : 'fa-star-o'"
             @click="newReview.rating = i">
          </i>
        </div>
      </div>
      
      <textarea 
        v-model="newReview.comment"
        placeholder="Yorumunuzu yazın..."
        required
      ></textarea>
      
      <button type="submit" class="submit-btn">
        Değerlendirme Yap
      </button>
    </form>

    <div class="reviews-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-item__header">
          <div class="user">
            <span class="name">{{ review.userName }}</span>
            <span class="date">{{ review.createdAt }}</span>
          </div>
          <div class="stars">
            <i v-for="i in 5" :key="i" class="fas" 
               :class="i <= review.rating ? 'fa-star' : 'fa-star-o'">
            </i>
          </div>
        </div>
        <p class="review-item__comment">{{ review.comment }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.book-reviews {
  background: var(--color-card-bg);
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;

  &__title {
    font-size: 1.5rem;
    margin: 0 0 1.5rem;
    color: var(--color-text-primary);
  }

  &__stats {
    margin-bottom: 2rem;
    
    .rating {
      display: flex;
      align-items: center;
      gap: 1rem;

      &__score {
        font-size: 2rem;
        font-weight: bold;
        color: var(--color-primary);
      }

      &__stars {
        color: var(--color-primary);
      }

      &__count {
        color: var(--color-text-secondary);
      }
    }
  }
}

.review-form {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--color-background);
  border-radius: 8px;

  &__rating {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;

    .stars {
      color: var(--color-primary);
      cursor: pointer;
    }
  }

  textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    resize: vertical;
  }

  .submit-btn {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }
}

.reviews-list {
  .review-item {
    padding: 1rem 0;
    border-bottom: 1px solid var(--color-border);

    &:last-child {
      border-bottom: none;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;

      .user {
        .name {
          font-weight: 500;
          margin-right: 1rem;
        }

        .date {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }
      }

      .stars {
        color: var(--color-primary);
      }
    }

    &__comment {
      margin: 0;
      line-height: 1.5;
      color: var(--color-text-secondary);
    }
  }
}
</style> 