const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

const stripTags = (input: string): string => {
  return input.replace(/<\/?[^>]+(>|$)/g, "")
}

export const sanitizeInput = (input: string): string => {
  return escapeHtml(stripTags(input.trim()))
}

export const sanitizeObject = <T extends { [K in keyof T]: T[K] }>(obj: T): T => {
  const result = { ...obj }
  for (const key in result) {
    if (typeof result[key] === 'string') {
      result[key] = sanitizeInput(result[key]) as T[typeof key]
    }
  }
  return result
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  // En az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return passwordRegex.test(password)
}

export const validateISBN = (isbn: string): boolean => {
  // ISBN-13 formatı kontrolü
  const isbnRegex = /^(?:ISBN(?:-13)?:?\ )?(?=[0-9]{13}$|(?=(?:[0-9]+[-\ ]){4})[-\ 0-9]{17}$)97[89][-\ ]?[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9]$/
  return isbnRegex.test(isbn)
} 