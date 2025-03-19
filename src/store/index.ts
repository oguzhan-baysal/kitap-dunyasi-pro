import { createStore } from 'vuex'
import { RootState } from './types'
import { books } from './modules/books'
import { auth } from './modules/auth'
import { currency } from './modules/currency'
import { favorites } from './modules/favorites'

export const store = createStore<RootState>({
  modules: {
    books,
    auth,
    currency,
    favorites
  }
})

export function useStore() {
  return store
}

export default store 