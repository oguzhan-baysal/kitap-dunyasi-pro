<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import type { Book } from '@/types'

const props = defineProps<{
  initialBook?: Book
}>()

const store = useStore()

const steps = [
  { id: 1, title: 'Temel Bilgiler' },
  { id: 2, title: 'Detaylar' },
  { id: 3, title: 'Görsel ve Açıklama' }
]

const currentStep = ref(1)
const formData = ref({
  title: props.initialBook?.title || '',
  author: props.initialBook?.author || '',
  price: props.initialBook?.price || 0,
  category: props.initialBook?.category || '',
  language: props.initialBook?.language || '',
  pageCount: props.initialBook?.pageCount || 0,
  publishYear: props.initialBook?.publishYear || new Date().getFullYear(),
  publisher: props.initialBook?.publisher || '',
  isbn: props.initialBook?.isbn || '',
  description: props.initialBook?.description || '',
  coverImage: props.initialBook?.coverImage || ''
})

const categories = [
  'Roman',
  'Öykü',
  'Şiir',
  'Bilim',
  'Tarih',
  'Felsefe'
]

const languages = [
  'Türkçe',
  'İngilizce',
  'Almanca',
  'Fransızca'
]

const isEditing = computed(() => !!props.initialBook)

const emit = defineEmits(['submit'])

const nextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.coverImage = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = () => {
  emit('submit', {
    ...formData.value,
    id: props.initialBook?.id || Date.now().toString()
  })
}
</script>

<template>
  <div class="book-form">
    <div class="steps">
      <div 
        v-for="step in steps" 
        :key="step.id"
        class="step"
        :class="{ active: currentStep === step.id, completed: currentStep > step.id }"
      >
        <div class="step-number">{{ step.id }}</div>
        <div class="step-title">{{ step.title }}</div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Adım 1: Temel Bilgiler -->
      <div v-if="currentStep === 1" class="form-step">
        <div class="form-group">
          <label>Kitap Adı</label>
          <input 
            v-model="formData.title"
            type="text"
            required
            placeholder="Kitap adını girin"
          >
        </div>

        <div class="form-group">
          <label>Yazar</label>
          <input 
            v-model="formData.author"
            type="text"
            required
            placeholder="Yazar adını girin"
          >
        </div>

        <div class="form-group">
          <label>Fiyat</label>
          <input 
            v-model.number="formData.price"
            type="number"
            required
            min="0"
            step="0.01"
          >
        </div>
      </div>

      <!-- Adım 2: Detaylar -->
      <div v-if="currentStep === 2" class="form-step">
        <div class="form-group">
          <label>Kategori</label>
          <select v-model="formData.category" required>
            <option value="">Kategori seçin</option>
            <option 
              v-for="category in categories" 
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Dil</label>
          <select v-model="formData.language" required>
            <option value="">Dil seçin</option>
            <option 
              v-for="language in languages" 
              :key="language"
              :value="language"
            >
              {{ language }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Sayfa Sayısı</label>
          <input 
            v-model.number="formData.pageCount"
            type="number"
            required
            min="1"
          >
        </div>

        <div class="form-group">
          <label>Yayın Yılı</label>
          <input 
            v-model.number="formData.publishYear"
            type="number"
            required
            :max="new Date().getFullYear()"
          >
        </div>

        <div class="form-group">
          <label>Yayınevi</label>
          <input 
            v-model="formData.publisher"
            type="text"
            required
          >
        </div>

        <div class="form-group">
          <label>ISBN</label>
          <input 
            v-model="formData.isbn"
            type="text"
            required
            pattern="[0-9]{13}"
            placeholder="13 haneli ISBN numarası"
          >
        </div>
      </div>

      <!-- Adım 3: Görsel ve Açıklama -->
      <div v-if="currentStep === 3" class="form-step">
        <div class="form-group">
          <label>Kapak Görseli</label>
          <input 
            type="file"
            accept="image/*"
            @change="handleImageUpload"
          >
          <img 
            v-if="formData.coverImage"
            :src="formData.coverImage"
            alt="Kapak önizleme"
            class="cover-preview"
          >
        </div>

        <div class="form-group">
          <label>Açıklama</label>
          <textarea 
            v-model="formData.description"
            required
            rows="5"
            placeholder="Kitap açıklamasını girin"
          ></textarea>
        </div>
      </div>

      <div class="form-actions">
        <button 
          type="button" 
          class="btn btn-secondary"
          @click="prevStep"
          v-if="currentStep > 1"
        >
          Geri
        </button>

        <button 
          v-if="currentStep < steps.length"
          type="button" 
          class="btn btn-primary"
          @click="nextStep"
        >
          İleri
        </button>

        <button 
          v-else
          type="submit" 
          class="btn btn-success"
        >
          {{ isEditing ? 'Güncelle' : 'Kaydet' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.book-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--color-card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);

  .step {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.active {
      .step-number {
        background: var(--color-primary);
        color: white;
      }
      .step-title {
        color: var(--color-primary);
      }
    }

    &.completed {
      .step-number {
        background: var(--color-success);
      }
    }

    .step-number {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-border);
      color: var(--color-text-secondary);
      border-radius: 50%;
      font-weight: bold;
    }

    .step-title {
      color: var(--color-text-secondary);
      font-weight: 500;
    }
  }
}

.form-step {
  display: grid;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: var(--color-text-primary);
  }

  input, select, textarea {
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  textarea {
    resize: vertical;
  }
}

.cover-preview {
  max-width: 200px;
  height: auto;
  margin-top: 1rem;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;

  &-primary {
    background: var(--color-primary);
    color: white;
  }

  &-secondary {
    background: var(--color-border);
    color: var(--color-text-primary);
  }

  &-success {
    background: var(--color-success);
    color: white;
  }

  &:hover {
    opacity: 0.9;
  }
}
</style> 