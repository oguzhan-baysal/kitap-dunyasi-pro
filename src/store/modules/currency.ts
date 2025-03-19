// @ts-ignore
import { Module } from 'vuex'
import { RootState, CurrencyState } from '../types'

const state = (): CurrencyState => ({
  rates: {},
  baseCurrency: 'TRY',
  selectedCurrency: 'TRY',
  loading: false,
  error: null
})

const getters = {
  getRate: (state: CurrencyState) => (currency: string): number => {
    if (currency === state.baseCurrency) return 1
    return state.rates[currency] || 1
  },
  getSelectedCurrency: (state: CurrencyState): string => state.selectedCurrency,
  getBaseCurrency: (state: CurrencyState): string => state.baseCurrency,
  isLoading: (state: CurrencyState): boolean => state.loading,
  getError: (state: CurrencyState): string | null => state.error
}

const mutations = {
  SET_RATES(state: CurrencyState, rates: { [key: string]: number }) {
    state.rates = rates
  },
  SET_SELECTED_CURRENCY(state: CurrencyState, currency: string) {
    state.selectedCurrency = currency
  },
  SET_LOADING(state: CurrencyState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: CurrencyState, error: string | null) {
    state.error = error
  }
}

const actions = {
  async fetchRates({ commit }: { commit: any }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      // Simüle edilmiş döviz kurları
      const mockRates = {
        USD: 0.032, // 1 TRY = 0.032 USD
        EUR: 0.029, // 1 TRY = 0.029 EUR
        GBP: 0.025  // 1 TRY = 0.025 GBP
      }

      commit('SET_RATES', mockRates)
    } catch (error) {
      console.error('Currency fetch error:', error)
      commit('SET_ERROR', 'Döviz kurları yüklenirken bir hata oluştu')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  setSelectedCurrency({ commit }: { commit: any }, currency: string) {
    commit('SET_SELECTED_CURRENCY', currency)
  }
}

export const currency: Module<CurrencyState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 