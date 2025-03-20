import axios from 'axios'

const API_KEY = import.meta.env.VITE_CURRENCY_API_KEY
const BASE_URL = 'https://api.freecurrencyapi.com/v1'

export interface ExchangeRates {
  [key: string]: number
}

export const currencyService = {
  async fetchRates(baseCurrency: string = 'TRY'): Promise<ExchangeRates> {
    try {
      console.log('Fetching currency rates...')
      console.log('API Key:', API_KEY)
      
      const response = await axios.get(`${BASE_URL}/latest`, {
        params: {
          apikey: API_KEY,
          base_currency: baseCurrency,
          currencies: 'USD,EUR,GBP,TRY'
        }
      })

      console.log('API Response:', response.data)
      
      if (!response.data || !response.data.data) {
        throw new Error('Invalid API response format')
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
      
      // Cache'den veri almayı dene
      const cached = this.getRatesFromCache()
      if (cached) {
        console.log('Using cached rates:', cached)
        return cached.rates
      }

      // Varsayılan kurları döndür
      return {
        USD: 0.032,
        EUR: 0.029,
        GBP: 0.025,
        TRY: 1
      }
    }
  },

  // LocalStorage işlemleri
  saveRatesToCache(rates: ExchangeRates): void {
    const cacheData = {
      rates,
      timestamp: new Date().getTime()
    }
    localStorage.setItem('exchangeRates', JSON.stringify(cacheData))
  },

  getRatesFromCache(): { rates: ExchangeRates; timestamp: number } | null {
    const cached = localStorage.getItem('exchangeRates')
    return cached ? JSON.parse(cached) : null
  },

  isCacheValid(timestamp: number): boolean {
    const THIRTY_MINUTES = 30 * 60 * 1000
    return new Date().getTime() - timestamp < THIRTY_MINUTES
  }
} 