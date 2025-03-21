import { ref, computed } from 'vue'
import { sanitizeInput, validateEmail, validatePassword, validateISBN } from '@/utils/sanitize'

interface ValidationRule {
  validate: (value: any) => boolean
  message: string
}

interface ValidationRules {
  [key: string]: ValidationRule[]
}

export function useFormValidation(initialData: Record<string, any> = {}) {
  const formData = ref(initialData)
  const errors = ref<Record<string, string[]>>({})
  const touched = ref<Record<string, boolean>>({})

  const rules: ValidationRules = {
    email: [
      {
        validate: (value) => !!value,
        message: 'E-posta adresi gerekli'
      },
      {
        validate: (value) => validateEmail(value),
        message: 'Geçerli bir e-posta adresi girin'
      }
    ],
    password: [
      {
        validate: (value) => !!value,
        message: 'Şifre gerekli'
      },
      {
        validate: (value) => validatePassword(value),
        message: 'Şifre en az 8 karakter, 1 büyük harf, 1 küçük harf ve 1 rakam içermeli'
      }
    ],
    title: [
      { 
        validate: (v: string) => !!v && v.length >= 3,
        message: 'Kitap adı en az 3 karakter olmalıdır'
      }
    ],
    author: [
      {
        validate: (v: string) => !!v && v.length >= 3,
        message: 'Yazar adı en az 3 karakter olmalıdır'
      }
    ],
    description: [
      {
        validate: (v: string) => !!v && v.length >= 10,
        message: 'Açıklama en az 10 karakter olmalıdır'
      }
    ],
    isbn: [
      {
        validate: (v: string) => !v || validateISBN(v),
        message: 'Geçerli bir ISBN-13 giriniz'
      }
    ],
    price: [
      {
        validate: (v: number) => v >= 0,
        message: 'Fiyat 0 veya daha büyük olmalıdır'
      }
    ]
  }

  const validateField = (field: string, value: any): string[] => {
    if (!rules[field]) return []

    const fieldErrors = rules[field]
      .map(rule => !rule.validate(value) ? rule.message : '')
      .filter(Boolean)

    errors.value[field] = fieldErrors
    return fieldErrors
  }

  const handleInput = (field: string, value: any) => {
    if (typeof value === 'string') {
      value = sanitizeInput(value)
    }
    formData.value[field] = value
    if (touched.value[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field: string) => {
    touched.value[field] = true
    validateField(field, formData.value[field])
  }

  const validateForm = (): boolean => {
    let isValid = true
    Object.keys(formData.value).forEach(field => {
      if (rules[field]) {
        touched.value[field] = true
        const fieldErrors = validateField(field, formData.value[field])
        if (fieldErrors.length > 0) {
          isValid = false
        }
      }
    })
    return isValid
  }

  const getFieldError = (field: string): string | undefined => {
    return touched.value[field] && errors.value[field]?.length > 0
      ? errors.value[field][0]
      : undefined
  }

  const isValid = computed(() => {
    return Object.keys(rules).every(field => {
      return !errors.value[field]?.length
    })
  })

  return {
    formData,
    errors,
    touched,
    isValid,
    handleInput,
    handleBlur,
    validateForm,
    getFieldError
  }
} 