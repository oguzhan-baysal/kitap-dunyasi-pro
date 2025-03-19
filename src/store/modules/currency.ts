import { Module } from 'vuex'
import axios from 'axios'
import { RootState } from '../types'

interface CurrencyState {
  rates: Record<string, number>
  selectedCurrency: string
  lastUpdate: number | null
  isLoading: boolean
  error: string | null
}

const state = (): CurrencyState => ({
  rates: {},
  selectedCurrency: 'TRY',
  lastUpdate: null,
  isLoading: false,
  error: null
})

const getters = {
  shouldUpdate: (state: CurrencyState): boolean => {
    if (!state.lastUpdate) return true
    // 30 dakikada bir güncelle
    return Date.now() - state.lastUpdate > 30 * 60 * 1000
  },

  availableCurrencies: (state: CurrencyState): string[] => {
    return ['TRY', 'USD', 'EUR', 'GBP', ...Object.keys(state.rates)]
  }
}

const mutations = {
  SET_RATES(state: CurrencyState, rates: Record<string, number>) {
    state.rates = rates
  },
  SET_LAST_UPDATE(state: CurrencyState, timestamp: number) {
    state.lastUpdate = timestamp
  },
  SET_SELECTED_CURRENCY(state: CurrencyState, currency: string) {
    state.selectedCurrency = currency
  },
  SET_LOADING(state: CurrencyState, loading: boolean) {
    state.isLoading = loading
  },
  SET_ERROR(state: CurrencyState, error: string | null) {
    state.error = error
  }
}

const actions = {
  async fetchRates({ commit, getters }: any) {
    if (!getters.shouldUpdate) return

    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.get(
        'https://api.exchangerate-api.com/v4/latest/USD'
      )

      commit('SET_RATES', response.data.rates)
      commit('SET_LAST_UPDATE', Date.now())

      // LocalStorage'a kaydet
      localStorage.setItem('currencyRates', JSON.stringify({
        rates: response.data.rates,
        lastUpdate: Date.now()
      }))

    } catch (error) {
      commit('SET_ERROR', 'Döviz kurları güncellenirken bir hata oluştu')
      console.error('Döviz kuru hatası:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  setSelectedCurrency({ commit }: any, currency: string) {
    commit('SET_SELECTED_CURRENCY', currency)
    localStorage.setItem('selectedCurrency', currency)
  },

  convertPrice({ state }: any, { price, fromCurrency = 'USD' }: { price: number, fromCurrency?: string }): number {
    if (!state.rates[fromCurrency] || !state.rates[state.selectedCurrency]) {
      return price
    }

    const inUSD = price / state.rates[fromCurrency]
    return Number((inUSD * state.rates[state.selectedCurrency]).toFixed(2))
  },

  formatPrice({ dispatch, state }: any, { price, fromCurrency = 'USD' }: { price: number, fromCurrency?: string }): string {
    const converted = dispatch('convertPrice', { price, fromCurrency })
    
    const formatter = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: state.selectedCurrency
    })

    return formatter.format(converted)
  },

  initializeFromStorage({ commit }: any) {
    // Seçili para birimini yükle
    const savedCurrency = localStorage.getItem('selectedCurrency')
    if (savedCurrency) {
      commit('SET_SELECTED_CURRENCY', savedCurrency)
    }

    // Kayıtlı kurları yükle
    const savedRates = localStorage.getItem('currencyRates')
    if (savedRates) {
      const { rates, lastUpdate } = JSON.parse(savedRates)
      commit('SET_RATES', rates)
      commit('SET_LAST_UPDATE', lastUpdate)
    }
  }
}

export const currency: Module<CurrencyState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 