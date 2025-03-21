import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-replace-in-production'
const SALT_ROUNDS = 10

// HTML karakterlerini escape et
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// HTML tag'lerini temizle
const stripTags = (input: string): string => {
  return input.replace(/<\/?[^>]+(>|$)/g, "")
}

// Input sanitizasyonu
export const sanitizeInput = (input: string): string => {
  return escapeHtml(stripTags(input.trim()))
}

// Password hashing
export const hashPassword = (password: string): string => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8)
  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: SALT_ROUNDS
  })
  return salt.toString() + ':' + hash.toString()
}

// Password verification
export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const [salt, originalHash] = hashedPassword.split(':')
  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: SALT_ROUNDS
  })
  return hash.toString() === originalHash
}

// Token şifreleme
export const encryptToken = (token: string): string => {
  try {
    return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString()
  } catch (error) {
    console.error('Token şifreleme hatası:', error)
    return token
  }
}

// Token şifre çözme
export const decryptToken = (encryptedToken: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Token şifre çözme hatası:', error)
    return encryptedToken
  }
}

// CSRF token oluşturma
export const generateCSRFToken = (): string => {
  const random = Math.random().toString(36).slice(2)
  const timestamp = Date.now().toString(36)
  return `${random}-${timestamp}`
}

// Rate limiting için sınıf
export class RateLimiter {
  private attempts: Map<string, { count: number; timestamp: number }>
  private maxAttempts: number
  private blockDuration: number

  constructor(maxAttempts = 5, blockDuration = 15 * 60 * 1000) {
    this.attempts = new Map()
    this.maxAttempts = maxAttempts
    this.blockDuration = blockDuration
  }

  isBlocked(key: string): boolean {
    const attempt = this.attempts.get(key)
    if (!attempt) return false

    const isBlocked = attempt.count >= this.maxAttempts &&
      Date.now() - attempt.timestamp < this.blockDuration

    if (!isBlocked) {
      this.attempts.delete(key)
    }

    return isBlocked
  }

  recordAttempt(key: string): void {
    const attempt = this.attempts.get(key)
    if (attempt) {
      attempt.count++
      attempt.timestamp = Date.now()
    } else {
      this.attempts.set(key, { count: 1, timestamp: Date.now() })
    }
  }

  getRemainingAttempts(key: string): number {
    const attempt = this.attempts.get(key)
    if (!attempt) return this.maxAttempts
    return Math.max(0, this.maxAttempts - attempt.count)
  }

  getBlockTimeRemaining(key: string): number {
    const attempt = this.attempts.get(key)
    if (!attempt || attempt.count < this.maxAttempts) return 0
    
    const timeElapsed = Date.now() - attempt.timestamp
    return Math.max(0, this.blockDuration - timeElapsed)
  }

  reset(key: string): void {
    this.attempts.delete(key)
  }
}

// XSS koruma için güvenli HTML
export const createSafeHTML = (html: string): string => {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

// Güvenli localStorage işlemleri
export const secureStorage = {
  setItem(key: string, value: any): void {
    try {
      const encryptedValue = encryptToken(JSON.stringify(value))
      localStorage.setItem(key, encryptedValue)
    } catch (error) {
      console.error(`Güvenli storage kayıt hatası (${key}):`, error)
    }
  },

  getItem<T>(key: string): T | null {
    try {
      const encryptedValue = localStorage.getItem(key)
      if (!encryptedValue) return null
      
      const decryptedValue = decryptToken(encryptedValue)
      return JSON.parse(decryptedValue)
    } catch (error) {
      console.error(`Güvenli storage okuma hatası (${key}):`, error)
      return null
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Güvenli storage silme hatası (${key}):`, error)
    }
  }
}

// SQL Injection koruması
export const sanitizeSQLInput = (input: string): string => {
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, "\\\\")
    .replace(/\0/g, "\\0")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
}

// Genel input validasyon kuralları
export const inputValidators = {
  // Sadece harf ve rakam
  alphanumeric: (value: string): boolean => /^[a-zA-Z0-9]+$/.test(value),
  
  // Sadece harf
  alphabetic: (value: string): boolean => /^[a-zA-Z]+$/.test(value),
  
  // Telefon numarası
  phone: (value: string): boolean => /^\+?[\d\s-]{10,}$/.test(value),
  
  // URL
  url: (value: string): boolean => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },
  
  // Tarih (YYYY-MM-DD)
  date: (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value),
  
  // Kredi kartı numarası (Luhn algoritması)
  creditCard: (value: string): boolean => {
    const sanitized = value.replace(/\D/g, '')
    if (!/^\d{13,19}$/.test(sanitized)) return false
    
    let sum = 0
    let isEven = false
    
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i])
      
      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  }
}

// Güvenli veri temizleme
export const sanitizeData = {
  // Güvenli metin
  text: (value: string): string => {
    const sanitized = sanitizeInput(value)
    return sanitizeSQLInput(sanitized)
  },
  
  // Güvenli sayı
  number: (value: string): number => {
    const num = parseFloat(value)
    return isNaN(num) ? 0 : num
  },
  
  // Güvenli boolean
  boolean: (value: any): boolean => {
    return Boolean(value)
  },
  
  // Güvenli tarih
  date: (value: string): Date | null => {
    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date
  }
}

// Güvenli veri doğrulama
export const validateData = {
  // Zorunlu alan kontrolü
  required: (value: any): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (typeof value === 'number') return !isNaN(value)
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object') return Object.keys(value).length > 0
    return Boolean(value)
  },
  
  // Minimum uzunluk
  minLength: (value: string, min: number): boolean => {
    return value.length >= min
  },
  
  // Maximum uzunluk
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max
  },
  
  // Değer aralığı
  range: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max
  }
} 