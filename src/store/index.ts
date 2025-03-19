// @ts-ignore
import { createStore } from 'vuex'
import { auth } from './modules/auth'
import { books } from './modules/books'
import { currency } from './modules/currency'
import { favorites } from './modules/favorites'
import { ui } from './modules/ui'
import type { RootState } from './types'

export default createStore<RootState>({
  state: {
    version: '1.0.0'
  },
  modules: {
    auth,
    books,
    currency,
    favorites,
    ui
  }
}) 