import { createStore } from 'vuex'
import type { RootState } from '@/types'

// Modülleri import et
import { auth } from '@/store/modules/auth'
import { books } from '@/store/modules/books'
import { currency } from '@/store/modules/currency'
import favorites from '@/store/modules/favorites'
import comments from '@/store/modules/comments'
import ui from '@/store/modules/ui'

const store = createStore<RootState>({
  state: () => ({
    version: '1.0.0'
  }),
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