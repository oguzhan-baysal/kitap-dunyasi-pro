import { createStore } from 'vuex'
import { auth } from './modules/auth'
import { books } from './modules/books'
import { currency } from './modules/currency'
import { comments } from './modules/comments'
import favorites from './modules/favorites'
import ui from './modules/ui'
import type { RootState } from './types'

const store = createStore<RootState>({
  state: () => ({
    version: '1.0.0',
    books: (books.state as () => any)(),
    auth: (auth.state as () => any)(),
    currency: (currency.state as () => any)(),
    favorites: (favorites.state as () => any)(),
    comments: (comments.state as () => any)(),
    ui: (ui.state as () => any)()
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

export default store 