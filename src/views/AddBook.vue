<template>
  <div class="add-book">
    <h1>Yeni Kitap Ekle</h1>
    
    <form @submit.prevent="handleSubmit" class="add-book-form">
      <div class="form-group">
        <label for="title">Kitap Adı</label>
        <input
          id="title"
          type="text"
          v-model="formData.title"
          required
          minlength="3"
          placeholder="Kitap adını girin"
          @input="validateField('title')"
          @blur="validateField('title')"
          :class="{ 'error': errors.title }"
        />
        <span class="error-message" v-if="errors.title">
          {{ errors.title }}
        </span>
      </div>

      <div class="form-group">
        <label for="author">Yazar</label>
        <input
          id="author"
          type="text"
          v-model="formData.author"
          required
          minlength="3"
          placeholder="Yazar adını girin"
          @input="validateField('author')"
          @blur="validateField('author')"
          :class="{ 'error': errors.author }"
        />
        <span class="error-message" v-if="errors.author">
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
          @input="validateField('price')"
          @blur="validateField('price')"
          :class="{ 'error': errors.price }"
        />
        <span class="error-message" v-if="errors.price">
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

      <button 
        type="submit" 
        :disabled="!isFormValid || loading"
        class="submit-button"
      >
        {{ loading ? 'Ekleniyor...' : 'Kitap Ekle' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const formData = ref({
  title: '',
  author: '',
  price: 0,
  description: '',
  coverImage: '',
  category: '',
  language: '',
  pageCount: 0,
  publishYear: new Date().getFullYear(),
  isFree: false
})

const loading = ref(false)
const errors = ref({
  title: '',
  author: '',
  price: ''
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
  errors.value[field] = ''
  
  switch (field) {
    case 'title':
      if (formData.value.title.length < 3) {
        errors.value.title = 'Kitap adı en az 3 karakter olmalıdır'
      }
      break
    case 'author':
      if (formData.value.author.length < 3) {
        errors.value.author = 'Yazar adı en az 3 karakter olmalıdır'
      }
      break
    case 'price':
      if (formData.value.price < 0) {
        errors.value.price = 'Fiyat 0\'dan küçük olamaz'
      }
      break
  }
}

const isFormValid = computed(() => {
  return formData.value.title.length >= 3 &&
         formData.value.author.length >= 3 &&
         formData.value.price >= 0 &&
         !errors.value.title &&
         !errors.value.author &&
         !errors.value.price
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    loading.value = true
    await store.dispatch('books/addBook', formData.value)
    router.push('/profile')
  } catch (error) {
    console.error('Kitap eklenirken hata oluştu:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.add-book {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;

  h1 {
    margin-bottom: 1.5rem;
    text-align: center;
    color: var(--color-text-primary);
    font-size: 1.75rem;
  }
}

.add-book-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  position: relative;

  label {
    font-weight: 500;
    color: var(--color-text-primary);
    font-size: 0.95rem;
  }

  input {
    padding: 0.625rem 0.875rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
    height: 42px;
    background-color: var(--color-input-bg);
    color: var(--color-text);

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
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    height: 0;
    overflow: hidden;
    transition: all 0.2s ease;
    opacity: 0;
    
    &.visible {
      height: 20px;
      opacity: 1;
    }
  }
}

.image-upload {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .file-input-container {
    position: relative;
    width: fit-content;

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
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #2980b9;
      }
    }
  }

  .image-preview {
    width: 100%;
    max-width: 300px;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: auto;
      display: block;
    }

    .remove-image {
      width: 100%;
      padding: 0.5rem;
      background: #e74c3c;
      color: white;
      border: none;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #c0392b;
      }
    }
  }
}

.submit-button {
  padding: 1rem;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #34495e;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
}
</style> 