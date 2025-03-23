import { createStore } from 'vuex'
import type { RootState } from '@/types'

// Modülleri import et
import { auth } from './modules/auth'
import { books } from './modules/books'
import { currency } from './modules/currency'
import favorites from './modules/favorites'
import comments from './modules/comments'
import ui from './modules/ui'

const store = createStore<RootState>({
  modules: {
    auth,
    books,
    currency,
    favorites,
    comments,
    ui
  }
})

export function useStore() {
  return store
}

export type Store = typeof store

export default store 