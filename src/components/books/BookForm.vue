<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Book } from '@/types/book'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, numeric } from '@vuelidate/validators'
import { useFormValidation } from '@/composables/useFormValidation'

const props = defineProps<{
  initialBook?: Book
}>()

const steps = ['Temel Bilgiler', 'Detaylar', 'Görsel']
const currentStep = ref(0)
const selectedImage = ref<File | null>(null)
const imagePreview = ref('')

const book = ref({
  title: '',
  author: '',
  description: '',
  price: 0,
  rating: 0,
  coverImage: '',
  category: '',
  publishDate: new Date().toISOString(),
  userId: 1,
  isFavorite: false
})

const rules = computed(() => ({
  title: { required, minLength: minLength(3) },
  author: { required, minLength: minLength(3) },
  price: { required },
  description: { required, minLength: minLength(10) },
  rating: { required, numeric }
}))

const v$ = useVuelidate(rules, book)

const emit = defineEmits<{
  (e: 'submit', book: Book): void
}>()

const stepFields = {
  0: ['title', 'author', 'price'],
  1: ['description', 'rating'],
  2: []
}

const validateStep = async (step: number) => {
  const fieldsToValidate = stepFields[step as keyof typeof stepFields]
  if (!fieldsToValidate.length) return true

  await v$.value.$touch()
  return !fieldsToValidate.some(field => v$.value[field].$error)
}

const nextStep = async () => {
  const isStepValid = await validateStep(currentStep.value)
  if (!isStepValid) return

  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedImage.value = input.files[0]
    imagePreview.value = URL.createObjectURL(input.files[0])
    book.value.coverImage = imagePreview.value
  }
}

const {
  formData,
  errors,
  touched,
  isValid,
  handleInput,
  handleBlur,
  validateForm,
  getFieldError
} = useFormValidation(props.initialBook || {
  title: '',
  author: '',
  description: '',
  price: 0,
  category: '',
  language: '',
  pageCount: 0,
  publishYear: new Date().getFullYear(),
  isbn: '',
  publisher: ''
})

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', formData.value as Book)
  }
}
</script>

<template>
  <div class="book-form">
    <div class="steps">
      <div
        v-for="(step, index) in steps"
        :key="step"
        class="step"
        :class="{ active: index === currentStep, completed: index < currentStep }"
      >
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-title">{{ step }}</div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Adım 1: Temel Bilgiler -->
      <div v-if="currentStep === 0" class="form-step">
        <div class="form-group">
          <label for="title">Kitap Adı *</label>
          <input
            id="title"
            v-model="formData.title"
            @input="handleInput('title', $event)"
            @blur="handleBlur('title')"
            type="text"
            :class="{ 'error': getFieldError('title') }"
          />
          <span class="error-message" v-if="getFieldError('title')">
            {{ getFieldError('title') }}
          </span>
        </div>

        <div class="form-group">
          <label for="author">Yazar *</label>
          <input
            id="author"
            v-model="formData.author"
            @input="handleInput('author', $event)"
            @blur="handleBlur('author')"
            type="text"
            :class="{ 'error': getFieldError('author') }"
          />
          <span class="error-message" v-if="getFieldError('author')">
            {{ getFieldError('author') }}
          </span>
        </div>

        <div class="form-group">
          <label for="price">Fiyat *</label>
          <input
            id="price"
            v-model.number="formData.price"
            @input="handleInput('price', $event)"
            @blur="handleBlur('price')"
            type="number"
            min="0"
            step="0.01"
            :class="{ 'error': getFieldError('price') }"
          />
          <span class="error-message" v-if="getFieldError('price')">
            {{ getFieldError('price') }}
          </span>
        </div>
      </div>

      <!-- Adım 2: Detaylar -->
      <div v-if="currentStep === 1" class="form-step">
        <div class="form-group">
          <label for="description">Açıklama *</label>
          <textarea
            id="description"
            v-model="formData.description"
            @input="handleInput('description', $event)"
            @blur="handleBlur('description')"
            :class="{ 'error': getFieldError('description') }"
          ></textarea>
          <span class="error-message" v-if="getFieldError('description')">
            {{ getFieldError('description') }}
          </span>
        </div>

        <div class="form-group">
          <label for="rating">Değerlendirme</label>
          <input
            id="rating"
            v-model.number="book.rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            :class="{ error: v$.rating.$error }"
          >
          <span v-if="v$.rating.$error" class="error-text">
            Değerlendirme 0-5 arasında olmalıdır
          </span>
        </div>
      </div>

      <!-- Adım 3: Görsel -->
      <div v-if="currentStep === 2" class="form-step">
        <div class="form-group">
          <label for="image">Kitap Kapağı</label>
          <div class="image-upload">
            <input
              id="image"
              type="file"
              accept="image/*"
              @change="handleImageSelect"
            >
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Kitap kapağı önizleme">
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="btn-secondary"
          @click="prevStep"
          v-if="currentStep > 0"
        >
          Geri
        </button>
        
        <button
          v-if="currentStep < steps.length - 1"
          type="button"
          class="btn-primary"
          @click="nextStep"
        >
          İleri
        </button>

        <button
          v-else
          type="submit"
          class="btn-success"
          :disabled="!isValid"
        >
          {{ props.initialBook ? 'Güncelle' : 'Ekle' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.book-form {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-6;
  background: var(--color-background-soft);
  border-radius: $border-radius;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-8;
  padding: 0 $spacing-4;

  .step {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    color: var(--color-text-light);

    &.active {
      color: var(--color-primary);

      .step-number {
        background: var(--color-primary);
        color: white;
      }
    }

    &.completed {
      color: var(--color-success);

      .step-number {
        background: var(--color-success);
        color: white;
      }
    }

    .step-number {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--color-border);
      color: var(--color-text);
      font-weight: $font-weight-medium;
    }

    .step-title {
      font-weight: $font-weight-medium;
    }
  }
}

.form-content {
  .form-step {
    animation: fadeIn 0.3s ease-in-out;
  }

  .form-group {
    margin-bottom: $spacing-4;

    label {
      display: block;
      margin-bottom: $spacing-2;
      color: var(--color-text);
      font-weight: $font-weight-medium;
    }

    input,
    textarea {
      width: 100%;
      padding: $spacing-3;
      border: 1px solid var(--color-border);
      border-radius: $border-radius;
      background: var(--color-background);
      color: var(--color-text);
      font-family: inherit;

      &.error {
        border-color: var(--color-error);
      }

      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }

    textarea {
      resize: vertical;
    }

    .error-message {
      display: block;
      margin-top: $spacing-1;
      color: var(--color-error);
      font-size: $font-size-sm;
    }
  }

  .image-upload {
    input[type="file"] {
      margin-bottom: $spacing-4;
    }

    .image-preview {
      max-width: 300px;
      margin-top: $spacing-4;

      img {
        width: 100%;
        height: auto;
        border-radius: $border-radius;
      }
    }
  }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: $spacing-6;
  padding-top: $spacing-6;
  border-top: 1px solid var(--color-border);

  button {
    padding: $spacing-2 $spacing-6;
    border: none;
    border-radius: $border-radius;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: background-color 0.2s;

    &.btn-primary {
      background: var(--color-primary);
      color: white;

      &:hover {
        background: var(--color-primary-dark);
      }
    }

    &.btn-secondary {
      background: var(--color-border);
      color: var(--color-text);

      &:hover {
        background: var(--color-border-dark);
      }
    }

    &.btn-success {
      background: var(--color-success);
      color: white;

      &:hover {
        background: var(--color-success-dark);
      }
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .book-form {
    padding: $spacing-4;
  }

  .steps {
    flex-direction: column;
    gap: $spacing-4;
    margin-bottom: $spacing-6;

    .step {
      justify-content: flex-start;
    }
  }
}
</style> 