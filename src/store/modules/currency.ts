// @ts-ignore
import { Module } from 'vuex'
import { RootState, CurrencyState } from '../types'
import { currencyService, ExchangeRates } from '@/services/currencyService'

const state = (): CurrencyState => ({
  rates: {},
  baseCurrency: 'TRY',
  selectedCurrency: 'TRY',
  loading: false,
  error: null,
  lastUpdate: null
})

const getters = {
  getRate: (state: CurrencyState) => (currency: string): number => {
    if (currency === state.baseCurrency) return 1
    return state.rates[currency] || 1
  },
  getSelectedCurrency: (state: CurrencyState): string => state.selectedCurrency,
  getBaseCurrency: (state: CurrencyState): string => state.baseCurrency,
  isLoading: (state: CurrencyState): boolean => state.loading,
  getError: (state: CurrencyState): string | null => state.error,
  getLastUpdate: (state: CurrencyState): number | null => state.lastUpdate
}

const mutations = {
  SET_RATES(state: CurrencyState, rates: ExchangeRates) {
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
  },
  SET_LAST_UPDATE(state: CurrencyState, timestamp: number) {
    state.lastUpdate = timestamp
  }
}

const actions = {
  async fetchRates({ commit, state }: { commit: any; state: CurrencyState }) {
    try {
      // Önce cache'i kontrol et
      const cached = currencyService.getRatesFromCache()
      if (cached && currencyService.isCacheValid(cached.timestamp)) {
        commit('SET_RATES', cached.rates)
        commit('SET_LAST_UPDATE', cached.timestamp)
        return
      }

      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const rates = await currencyService.fetchRates(state.baseCurrency)
      
      // Kurları güncelle ve cache'e kaydet
      commit('SET_RATES', rates)
      commit('SET_LAST_UPDATE', new Date().getTime())
      currencyService.saveRatesToCache(rates)
    } catch (error) {
      console.error('Currency fetch error:', error)
      
      // Offline durumda cache'den al
      const cached = currencyService.getRatesFromCache()
      if (cached) {
        commit('SET_RATES', cached.rates)
        commit('SET_LAST_UPDATE', cached.timestamp)
        commit('SET_ERROR', 'Çevrimdışı mod: Son bilinen kurlar kullanılıyor')
      } else {
        commit('SET_ERROR', 'Döviz kurları yüklenirken bir hata oluştu')
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  setSelectedCurrency({ commit }: { commit: any }, currency: string) {
    commit('SET_SELECTED_CURRENCY', currency)
  },

  // 30 dakikada bir otomatik güncelleme
  startAutoUpdate({ dispatch }: { dispatch: any }) {
    const THIRTY_MINUTES = 30 * 60 * 1000
    setInterval(() => {
      dispatch('fetchRates')
    }, THIRTY_MINUTES)
  }
}

export const currency: Module<CurrencyState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 