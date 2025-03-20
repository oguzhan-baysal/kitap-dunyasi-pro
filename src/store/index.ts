import { createStore } from 'vuex'
import { RootState } from './types'
import { books } from './modules/books'
import { auth } from './modules/auth'
import { currency } from './modules/currency'
import { favorites } from './modules/favorites'
import { comments } from './modules/comments'

export const store = createStore<RootState>({
  state: {
    version: '1.0.0'
  },
  modules: {
    books,
    auth,
    currency,
    favorites,
    comments
  }
})

export function useStore() {
  return store
}

export default store 