<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import type { Book } from '@/types/book'

const route = useRoute()
const router = useRouter()
const store = useStore()

const isLoading = ref(true)
const loading = ref(false)
const error = ref<string | null>(null)

const formData = ref({
  title: '',
  author: '',
  price: 0,
  coverImage: '',
  description: '',
  category: '',
  language: '',
  pageCount: 0,
  publishYear: new Date().getFullYear(),
  isFree: false
})

const errors = ref({
  title: '',
  author: '',
  price: ''
})

const touched = ref({
  title: false,
  author: false,
  price: false
})

onMounted(async () => {
  const bookId = route.params.id
  if (bookId) {
    try {
      await store.dispatch('books/fetchBookDetails', parseInt(bookId as string))
      const book = store.getters['books/getBookById'](parseInt(bookId as string))
      if (book) {
        formData.value = { ...book }
      }
    } catch (err) {
      error.value = 'Kitap bilgileri yüklenirken bir hata oluştu.'
    }
  }
  isLoading.value = false
})

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    
    reader.onload = (e) => {
      if (e.target?.result) {
        formData.value.coverImage = e.target.result as string
      }
    }
    
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  formData.value.coverImage = ''
  const input = document.getElementById('coverImage') as HTMLInputElement
  if (input) {
    input.value = ''
  }
}

const validateField = (field: string) => {
  if (!touched.value[field] && !formData.value[field]) {
    errors.value[field] = ''
    return
  }

  switch (field) {
    case 'title':
      if (formData.value.title.length < 3) {
        errors.value.title = 'Kitap adı en az 3 karakter olmalıdır'
      } else {
        errors.value.title = ''
      }
      break
    case 'author':
      if (formData.value.author.length < 3) {
        errors.value.author = 'Yazar adı en az 3 karakter olmalıdır'
      } else {
        errors.value.author = ''
      }
      break
    case 'price':
      if (formData.value.price < 0) {
        errors.value.price = 'Fiyat 0\'dan küçük olamaz'
      } else {
        errors.value.price = ''
      }
      break
  }
}

const isFormValid = computed(() => {
  if (!touched.value.title && !touched.value.author && !touched.value.price) {
    return true
  }

  return (!touched.value.title || formData.value.title.length >= 3) &&
         (!touched.value.author || formData.value.author.length >= 3) &&
         (!touched.value.price || formData.value.price >= 0)
})

const handleFocus = (field: string) => {
  touched.value[field] = true
  errors.value[field] = ''
}

const handleBlur = (field: string) => {
  if (formData.value[field]) {
    validateField(field)
  }
}

const handleInput = (field: string) => {
  if (errors.value[field]) {
    switch (field) {
      case 'title':
        if (formData.value.title.length >= 3) {
          errors.value.title = ''
        }
        break
      case 'author':
        if (formData.value.author.length >= 3) {
          errors.value.author = ''
        }
        break
      case 'price':
        if (formData.value.price >= 0) {
          errors.value.price = ''
        }
        break
    }
  }
}

const handleSubmit = async () => {
  validateField('title')
  validateField('author')
  validateField('price')

  if (Object.values(errors.value).some(error => error !== '')) {
    return
  }

  try {
    loading.value = true
    if (route.params.id) {
      await store.dispatch('books/updateBook', {
        id: parseInt(route.params.id as string),
        ...formData.value
      })
    } else {
      await store.dispatch('books/addBook', formData.value)
    }
    router.push('/profile')
  } catch (err) {
    error.value = 'Kitap kaydedilirken bir hata oluştu.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="book-manage">
    <h1>{{ route.params.id ? 'Kitap Düzenle' : 'Yeni Kitap Ekle' }}</h1>

    <div v-if="isLoading" class="loading">
      Yükleniyor...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <form v-else @submit.prevent="handleSubmit" class="edit-form">
      <div class="form-group">
        <label for="title">Kitap Adı</label>
        <input
          id="title"
          type="text"
          v-model.trim="formData.title"
          required
          minlength="3"
          placeholder="Kitap adını girin"
          @focus="handleFocus('title')"
          @blur="handleBlur('title')"
          @input="handleInput('title')"
          :class="{ 'error': errors.title }"
        />
        <span class="error-message" :class="{ 'visible': errors.title }">
          {{ errors.title }}
        </span>
      </div>

      <div class="form-group">
        <label for="author">Yazar</label>
        <input
          id="author"
          type="text"
          v-model.trim="formData.author"
          required
          minlength="3"
          placeholder="Yazar adını girin"
          @focus="handleFocus('author')"
          @blur="handleBlur('author')"
          @input="handleInput('author')"
          :class="{ 'error': errors.author }"
        />
        <span class="error-message" :class="{ 'visible': errors.author }">
          {{ errors.author }}
        </span>
      </div>

      <div class="form-group">
        <label for="price">Fiyat</label>
        <input
          id="price"
          type="number"
          v-model.number="formData.price"
          required
          min="0"
          step="0.01"
          placeholder="Fiyat girin"
          @focus="handleFocus('price')"
          @blur="handleBlur('price')"
          @input="handleInput('price')"
          :class="{ 'error': errors.price }"
        />
        <span class="error-message" :class="{ 'visible': errors.price }">
          {{ errors.price }}
        </span>
      </div>

      <div class="form-group">
        <label for="coverImage">Kitap Kapağı</label>
        <div class="image-upload">
          <div class="file-input-container">
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="file-input"
            />
            <button type="button" class="select-file-button">
              Dosya Seç
            </button>
          </div>
          <div v-if="formData.coverImage" class="image-preview">
            <img :src="formData.coverImage" alt="Kitap kapağı önizleme" />
            <button type="button" class="remove-image" @click="removeImage">
              Resmi Kaldır
            </button>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="cancel-button" @click="router.back()">
          İptal
        </button>
        <button 
          type="submit" 
          :disabled="!isFormValid || loading"
          class="submit-button"
        >
          {{ loading ? 'Kaydediliyor...' : 'Kaydet' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
@use '@/assets/styles/_variables.scss' as *;

.book-manage {
  max-width: 500px;
  margin: 2rem auto;
  padding: 0 1rem;

  @media (max-width: $breakpoint-sm) {
    margin: 1rem auto;
    padding: 0 0.5rem;
  }

  h1 {
    margin-bottom: 1.5rem;
    text-align: center;
    color: var(--color-text-primary);
    font-size: 1.75rem;
    font-weight: 600;

    @media (max-width: $breakpoint-sm) {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
  }
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: var(--color-card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: $breakpoint-sm) {
    padding: 1rem;
    gap: 1rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  position: relative;
  margin-bottom: 1.5rem;

  @media (max-width: $breakpoint-sm) {
    gap: 0.25rem;
    margin-bottom: 1.25rem;
  }

  label {
    font-weight: 500;
    color: var(--color-text-primary);
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    @media (max-width: $breakpoint-sm) {
      font-size: 0.875rem;
    }

    &::after {
      content: "*";
      color: var(--color-error);
      font-size: 1rem;
      line-height: 1;
    }
  }

  &:last-of-type label::after {
    content: none;
  }

  input {
    padding: 0.625rem 0.875rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.2s ease;
    width: 100%;
    box-sizing: border-box;
    height: 42px;
    min-height: 42px;
    max-height: 42px;
    background-color: var(--color-input-bg);
    color: var(--color-text);

    @media (max-width: $breakpoint-sm) {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      height: 38px;
      min-height: 38px;
      max-height: 38px;
    }

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    &::placeholder {
      color: var(--color-placeholder);
    }

    &.error {
      border-color: var(--color-error);
    }
  }

  .error-message {
    position: absolute;
    bottom: -20px;
    left: 0;
    color: var(--color-error);
    font-size: 0.875rem;
    margin: 0;
    padding: 0;
    height: 20px;
    line-height: 20px;

    @media (max-width: $breakpoint-sm) {
      font-size: 0.75rem;
      bottom: -18px;
      height: 18px;
      line-height: 18px;
    }
  }
}

.image-upload {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: $breakpoint-sm) {
    gap: 0.75rem;
  }

  .file-input-container {
    position: relative;
    width: fit-content;

    @media (max-width: $breakpoint-sm) {
      width: 100%;
    }

    .file-input {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
      z-index: 2;
    }

    .select-file-button {
      padding: 0.75rem 1.5rem;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;

      @media (max-width: $breakpoint-sm) {
        width: 100%;
        padding: 0.625rem 1rem;
        font-size: 0.875rem;
      }

      &:hover {
        background: var(--color-primary-dark);
      }
    }
  }

  .image-preview {
    width: 100%;
    max-width: 300px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    @media (max-width: $breakpoint-sm) {
      max-width: 100%;
    }

    img {
      width: 100%;
      height: auto;
      display: block;
    }

    .remove-image {
      width: 100%;
      padding: 0.75rem;
      background: var(--color-error);
      color: white;
      border: none;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;

      @media (max-width: $breakpoint-sm) {
        padding: 0.625rem;
        font-size: 0.8125rem;
      }

      &:hover {
        background: var(--color-error-dark);
      }
    }
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column-reverse;
    margin-top: 1.5rem;
    gap: 0.75rem;
  }

  button {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    @media (max-width: $breakpoint-sm) {
      padding: 0.875rem;
      font-size: 0.9375rem;
    }
  }

  .cancel-button {
    background: var(--color-border);
    color: var(--color-text);

    &:hover {
      background: var(--color-border-dark);
    }
  }

  .submit-button {
    background: var(--color-primary);
    color: white;

    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }

    &:disabled {
      background: var(--color-disabled-bg);
      cursor: not-allowed;
      opacity: 0.7;
    }
  }
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: var(--color-text);

  @media (max-width: $breakpoint-sm) {
    padding: 1.5rem;
    font-size: 0.875rem;
  }
}

.error {
  color: var(--color-error);
}
</style> 