import { createStore, Store as VuexStore, useStore as baseUseStore } from 'vuex'
import type { RootState } from './store/types'

// Modülleri import et
import { auth } from '@/store/modules/auth'
import { books } from '@/store/modules/books'
import { currency } from '@/store/modules/currency'
import favorites from '@/store/modules/favorites'
import comments from '@/store/modules/comments'
import ui from '@/store/modules/ui'

// Store tipini tanımla
export type Store = VuexStore<RootState>

// Store'u oluştur
export const store = createStore({
  state: {
    version: '1.0.0'
  },
  modules: {
    auth: auth as any,
    books: books as any,
    currency: currency as any,
    favorites: favorites as any,
    comments: comments as any,
    ui: ui as any
  }
})

// useStore hook'unu oluştur
export function useStore(): Store {
  return baseUseStore() as Store
}

export default store 