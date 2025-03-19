import { createStore } from 'vuex'
import { auth } from './modules/auth'
import { currency } from './modules/currency'
import type { RootState } from './types'

export default createStore<RootState>({
  state: {
    version: '1.0.0'
  },
  modules: {
    auth,
    currency
  }
}) 