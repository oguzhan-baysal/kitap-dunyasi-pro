// @ts-ignore
import { Module, Commit } from 'vuex'
import { RootState } from '../types'
import type { Book } from '@/types/book'

interface BooksState {
  books: Book[]
  currentPage: number
  itemsPerPage: number
  hasMore: boolean
  loading: boolean
  error: string | null
  filters: {
    category: string | null
    minPrice: number | null
    maxPrice: number | null
    rating: number | null
  }
  sort: {
    field: string
    order: 'asc' | 'desc'
  }
}

interface BooksActionContext {
  commit: Commit
  state: BooksState
  dispatch: (action: string) => Promise<void>
}

const state = (): BooksState => ({
  books: [],
  currentPage: 1,
  itemsPerPage: 12,
  hasMore: true,
  loading: false,
  error: null,
  filters: {
    category: null,
    minPrice: null,
    maxPrice: null,
    rating: null
  },
  sort: {
    field: 'title',
    order: 'asc'
  }
})

const getters = {
  getBooks: (state: BooksState): Book[] => state.books,
  getLoading: (state: BooksState): boolean => state.loading,
  getError: (state: BooksState): string | null => state.error,
  getFilters: (state: BooksState) => state.filters,
  getSort: (state: BooksState) => state.sort,
  allBooks: (state: BooksState): Book[] => state.books,
  isLoading: (state: BooksState): boolean => state.loading,
  hasError: (state: BooksState): boolean => !!state.error,
  errorMessage: (state: BooksState): string | null => state.error,
  hasMoreBooks: (state: BooksState): boolean => state.hasMore,
  
  featuredBooks: (state: BooksState): Book[] => {
    return state.books.filter(book => book.rating >= 4.0).slice(0, 5)
  },

  getFilteredAndSortedBooks: (state: BooksState): Book[] => {
    let filteredBooks = [...state.books]

    // Filtreleme işlemleri
    if (state.filters.category) {
      filteredBooks = filteredBooks.filter(book => book.category === state.filters.category)
    }

    if (state.filters.minPrice !== null) {
      filteredBooks = filteredBooks.filter(book => book.price >= state.filters.minPrice!)
    }

    if (state.filters.maxPrice !== null) {
      filteredBooks = filteredBooks.filter(book => book.price <= state.filters.maxPrice!)
    }

    // Sıralama işlemi
    filteredBooks.sort((a, b) => {
      const field = state.sort.field
      const order = state.sort.order === 'asc' ? 1 : -1

      switch (field) {
        case 'title':
          return a.title.localeCompare(b.title) * order
        case 'price':
          return (a.price - b.price) * order
        case 'rating':
          return (a.rating - b.rating) * order
        case 'publishDate':
          if (!a.publishDate || !b.publishDate) return 0
          return (new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()) * order
        default:
          return 0
      }
    })

    return filteredBooks
  },

  getBookById: (state: BooksState) => (id: number) => {
    return state.books.find(book => book.id === id)
  },

  getRelatedBooks: (state: BooksState) => ({ category, excludeId, limit }: { category: string, excludeId: number, limit: number }) => {
    return state.books
      .filter(book => book.category === category && book.id !== excludeId)
      .slice(0, limit)
  }
}

const mutations = {
  SET_BOOKS(state: BooksState, books: Book[]) {
    state.books = books
  },
  SET_LOADING(state: BooksState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: BooksState, error: string | null) {
    state.error = error
  },
  UPDATE_FILTERS(state: BooksState, filters: BooksState['filters']) {
    state.filters = filters
  },
  UPDATE_SORT(state: BooksState, sort: BooksState['sort']) {
    state.sort = sort
  },
  setBooks(state: BooksState, books: Book[]) {
    state.books = books
  },
  appendBooks(state: BooksState, books: Book[]) {
    state.books.push(...books)
  },
  setCurrentPage(state: BooksState, page: number) {
    state.currentPage = page
  },
  setHasMore(state: BooksState, hasMore: boolean) {
    state.hasMore = hasMore
  },
  setLoading(state: BooksState, loading: boolean) {
    state.loading = loading
  },
  setError(state: BooksState, error: string | null) {
    state.error = error
  },
  toggleFavorite(state: BooksState, bookId: number) {
    const book = state.books.find(b => b.id === bookId)
    if (book) {
      book.isFavorite = !book.isFavorite
    }
  },
  setSortBy(state: BooksState, sortBy: string) {
    state.sort.field = sortBy
  },
  addBook(state: BooksState, book: Book) {
    state.books.push(book)
  },
  updateBook(state: BooksState, updatedBook: Book) {
    const index = state.books.findIndex(book => book.id === updatedBook.id)
    if (index !== -1) {
      state.books[index] = updatedBook
    }
  }
}

const actions = {
  async initialize({ commit }: { commit: Commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    // Mock kitap verisi
    const mockBooks: Book[] = [
      {
        id: 1,
        title: "1984",
        author: "George Orwell",
        description: "Distopik bir gelecekte geçen, gözetim toplumunu ve totaliter rejimi eleştiren başyapıt...",
        price: 45.99,
        rating: 4.8,
        publishDate: "1949-06-08",
        coverImage: "/images/books/1984.jpg",
        category: "Roman",
        isFavorite: false
      },
      {
        id: 2,
        title: "Atomik Alışkanlıklar",
        author: "James Clear",
        description: "Küçük değişikliklerle büyük sonuçlar elde etmenin bilimsel yöntemlerini anlatan kişisel gelişim kitabı...",
        price: 52.99,
        rating: 4.9,
        publishDate: "2018-10-16",
        coverImage: "/images/books/atomic-habits.jpg",
        category: "Kişisel Gelişim",
        isFavorite: false
      },
      {
        id: 3,
        title: "Suç ve Ceza",
        author: "Fyodor Dostoyevski",
        description: "İnsanın karanlık yönlerini ve vicdan kavramını derinlemesine inceleyen psikolojik roman...",
        price: 49.99,
        rating: 4.7,
        publishDate: "1866-01-01",
        coverImage: "/images/books/crime-and-punishment.jpg",
        category: "Roman",
        isFavorite: false
      },
      {
        id: 4,
        title: "Dune",
        author: "Frank Herbert",
        description: "Bilim kurgu edebiyatının en önemli eserlerinden biri...",
        price: 65.99,
        rating: 4.6,
        publishDate: "1965-08-01",
        coverImage: "/images/books/dune.jpg",
        category: "Bilim Kurgu",
        isFavorite: false
      },
      {
        id: 5,
        title: "Yüzüklerin Efendisi",
        author: "J.R.R. Tolkien",
        description: "Fantastik edebiyatın başyapıtı, epik bir macera...",
        price: 89.99,
        rating: 4.9,
        publishDate: "1954-07-29",
        coverImage: "/images/books/lord-of-the-rings.jpg",
        category: "Fantastik",
        isFavorite: false
      }
    ]

    commit('SET_BOOKS', mockBooks)
  },

  async fetchBooks({ commit, state }: BooksActionContext) {
    try {
      commit('setLoading', true)
      commit('setError', null)

      // Simüle edilmiş API çağrısı
      const response = await new Promise<Book[]>((resolve) => {
        setTimeout(() => {
          const categories = ['Roman', 'Bilim Kurgu', 'Fantastik', 'Kişisel Gelişim', 'Tarih']
          const mockBooks: Book[] = Array.from({ length: state.itemsPerPage }, (_, index) => ({
            id: state.books.length + index + 1,
            title: `Kitap ${state.books.length + index + 1}`,
            author: `Yazar ${state.books.length + index + 1}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price: Math.floor(Math.random() * 200) + 20,
            coverImage: `/images/books/placeholder.jpg`,
            rating: (Math.floor(Math.random() * 10) + 35) / 10, // 3.5 ile 4.5 arası
            publishDate: new Date().toISOString(),
            category: categories[Math.floor(Math.random() * categories.length)],
            isFavorite: false
          }))
          resolve(mockBooks)
        }, 1000)
      })

      if (state.currentPage === 1) {
        commit('setBooks', response)
      } else {
        commit('appendBooks', response)
      }

      // Simüle edilmiş sayfalama - 5 sayfadan sonra veri bitsin
      commit('setHasMore', state.currentPage < 5)
      commit('setCurrentPage', state.currentPage + 1)
    } catch (error) {
      commit('setError', 'Kitaplar yüklenirken bir hata oluştu')
      console.error('Kitaplar yüklenirken hata:', error)
    } finally {
      commit('setLoading', false)
    }
  },

  selectBook({ commit }: { commit: Commit }, book: Book | null) {
    commit('SET_SELECTED_BOOK', book)
  },

  updateFilters({ commit }: { commit: Commit }, filters: BooksState['filters']) {
    commit('UPDATE_FILTERS', filters)
  },

  updateSort({ commit }: { commit: Commit }, sort: BooksState['sort']) {
    commit('UPDATE_SORT', sort)
  },

  async loadMoreBooks({ dispatch, state, commit }: BooksActionContext) {
    if (state.loading || !state.hasMore) return

    await dispatch('fetchBooks')
  },

  toggleFavorite({ commit }: { commit: Commit }, bookId: number) {
    commit('toggleFavorite', bookId)
  },

  updateSortBy({ commit }: { commit: Commit }, sortBy: string) {
    commit('setSortBy', sortBy)
  },

  async fetchBookDetails({ commit, getters }: { commit: Commit, getters: any }, bookId: number) {
    try {
      commit('setLoading', true)
      commit('setError', null)

      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const book = getters.getBookById(bookId)
      if (!book) {
        throw new Error('Kitap bulunamadı')
      }

      return book
    } catch (error) {
      console.error('Kitap detayları yüklenirken hata:', error)
      commit('setError', 'Kitap detayları yüklenirken bir hata oluştu')
      throw error
    } finally {
      commit('setLoading', false)
    }
  },

  async addBook({ commit }: { commit: Commit }, book: Omit<Book, 'id'>) {
    commit('setLoading', true)
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newBook: Book = {
        id: Date.now(),
        ...book
      }
      
      commit('addBook', newBook)
      commit('setError', null)
      return newBook
    } catch (error) {
      commit('setError', 'Kitap eklenirken bir hata oluştu.')
      throw error
    } finally {
      commit('setLoading', false)
    }
  },

  async updateBook({ commit }: { commit: Commit }, book: Book) {
    commit('setLoading', true)
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      commit('updateBook', book)
      commit('setError', null)
      return book
    } catch (error) {
      commit('setError', 'Kitap güncellenirken bir hata oluştu.')
      throw error
    } finally {
      commit('setLoading', false)
    }
  }
}

export const books: Module<BooksState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 