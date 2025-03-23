import { createStore, Store as VuexStore, useStore as baseUseStore } from 'vuex'
import type { RootState } from './types'

// Modülleri import et
import { auth } from './modules/auth'
import { books } from './modules/books'
import { currency } from './modules/currency'
import favorites from './modules/favorites'
import comments from './modules/comments'
import ui from './modules/ui'

// Store tipini tanımla
export type Store = VuexStore<RootState>

// Store'u oluştur
const store = createStore({
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