// @ts-ignore
import { Module, Commit, ActionContext } from 'vuex'
import type { RootState, BooksState, Book } from '@/types'

interface BooksActionContext extends ActionContext<BooksState, RootState> {
  commit: Commit
  state: BooksState
  rootState: RootState
  dispatch: (action: string) => Promise<void>
}

const state = (): BooksState => ({
  books: [],
  userBooks: [],
  userFavorites: [],
  currentBook: null,
  currentPage: 1,
  itemsPerPage: 12,
  hasMore: true,
  loading: false,
  error: null,
  newBook: null,
  filters: {
    search: null,
    category: null,
    language: null,
    minPrice: null,
    maxPrice: null,
    minYear: null,
    maxYear: null,
    minPages: null,
    maxPages: null,
    isFree: null,
    rating: null
  },
  sort: {
    field: 'title',
    order: 'asc'
  }
})

const getters = {
  allBooks: (state: BooksState): Book[] => state.books,
  userBooks: (state: BooksState): Book[] => state.userBooks,
  userFavorites: (state: BooksState): Book[] => state.userFavorites,
  currentBook: (state: BooksState): Book | null => state.currentBook,
  loading: (state: BooksState): boolean => state.loading,
  error: (state: BooksState): string | null => state.error,
  hasMoreBooks: (state: BooksState): boolean => state.hasMore,
  
  featuredBooks: (state: BooksState): Book[] => {
    return state.books.filter(book => book.rating && book.rating >= 4.0).slice(0, 5)
  },

  getFilteredAndSortedBooks: (state: BooksState): Book[] => {
    let filteredBooks = [...state.books]

    // Arama filtresi
    if (state.filters.search) {
      const searchTerm = state.filters.search.toLowerCase()
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
      )
    }

    // Kategori filtresi
    if (state.filters.category) {
      filteredBooks = filteredBooks.filter(book => book.category === state.filters.category)
    }

    // Dil filtresi
    if (state.filters.language) {
      filteredBooks = filteredBooks.filter(book => book.language === state.filters.language)
    }

    // Fiyat filtresi
    if (state.filters.minPrice !== null) {
      filteredBooks = filteredBooks.filter(book => book.price >= state.filters.minPrice!)
    }
    if (state.filters.maxPrice !== null) {
      filteredBooks = filteredBooks.filter(book => book.price <= state.filters.maxPrice!)
    }

    // Yıl filtresi
    if (state.filters.minYear !== null) {
      filteredBooks = filteredBooks.filter(book => typeof book.publishYear === 'number' && book.publishYear >= state.filters.minYear!)
    }
    if (state.filters.maxYear !== null) {
      filteredBooks = filteredBooks.filter(book => typeof book.publishYear === 'number' && book.publishYear <= state.filters.maxYear!)
    }

    // Sayfa sayısı filtresi
    if (state.filters.minPages !== null) {
      filteredBooks = filteredBooks.filter(book => typeof book.pageCount === 'number' && book.pageCount >= state.filters.minPages!)
    }
    if (state.filters.maxPages !== null) {
      filteredBooks = filteredBooks.filter(book => typeof book.pageCount === 'number' && book.pageCount <= state.filters.maxPages!)
    }

    // Ücretsiz/Ücretli filtresi
    if (state.filters.isFree !== null) {
      filteredBooks = filteredBooks.filter(book => book.isFree === state.filters.isFree)
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
          return ((a.rating || 0) - (b.rating || 0)) * order
        case 'publishYear':
          return ((typeof a.publishYear === 'number' ? a.publishYear : 0) - (typeof b.publishYear === 'number' ? b.publishYear : 0)) * order
        case 'pageCount':
          return ((typeof a.pageCount === 'number' ? a.pageCount : 0) - (typeof b.pageCount === 'number' ? b.pageCount : 0)) * order
        case 'publishDate':
          if (!a.publishDate || !b.publishDate) return 0
          return (new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()) * order
        default:
          return 0
      }
    })

    return filteredBooks
  },

  getBookById: (state: BooksState) => (id: number): Book | undefined => {
    return state.books.find(book => book.id === id)
  },

  getRelatedBooks: (state: BooksState) => ({ category, excludeId, limit }: { category: string, excludeId: number, limit: number }): Book[] => {
    return state.books
      .filter(book => book.category === category && book.id !== excludeId)
      .slice(0, limit)
  }
}

const mutations = {
  setBooks(state: BooksState, books: Book[]) {
    state.books = books
  },
  appendBooks(state: BooksState, books: Book[]) {
    state.books = [...state.books, ...books]
  },
  UPDATE_SORT(state: BooksState, { field, order }: { field: string, order: 'asc' | 'desc' }) {
    state.sort = { field, order }
  },
  setUserBooks(state: BooksState, books: Book[]) {
    state.userBooks = books
  },
  setUserFavorites(state: BooksState, books: Book[]) {
    state.userFavorites = books
  },
  setCurrentBook(state: BooksState, book: Book | null) {
    state.currentBook = book
  },
  addBook(state: BooksState, book: Book) {
    state.books.push(book)
    state.userBooks.push(book)
  },
  updateBook(state: BooksState, updatedBook: Book) {
    const index = state.books.findIndex(book => book.id === updatedBook.id)
    if (index !== -1) {
      state.books[index] = updatedBook
    }
    
    const userBookIndex = state.userBooks.findIndex(book => book.id === updatedBook.id)
    if (userBookIndex !== -1) {
      state.userBooks[userBookIndex] = updatedBook
    }
  },
  deleteBook(state: BooksState, bookId: number) {
    state.books = state.books.filter(book => book.id !== bookId)
    state.userBooks = state.userBooks.filter(book => book.id !== bookId)
  },
  toggleFavorite(state: BooksState, bookId: number) {
    // Ana kitap listesinde güncelle
    const bookIndex = state.books.findIndex(b => b.id === bookId)
    if (bookIndex !== -1) {
      const book = state.books[bookIndex]
      const isFavorite = !book.isFavorite
      
      // Ana kitap listesini güncelle
      state.books[bookIndex] = {
        ...book,
        isFavorite
      }
      
      // Favori listesini güncelle
      const updatedFavorites = isFavorite 
        ? [...state.userFavorites, state.books[bookIndex]]
        : state.userFavorites.filter(b => b.id !== bookId)
      
      state.userFavorites = updatedFavorites
      
      // LocalStorage'ı güncelle
      localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites))
    }
  },
  setLoading(state: BooksState, loading: boolean) {
    state.loading = loading
  },
  setError(state: BooksState, error: string | null) {
    state.error = error
  },
  setCurrentPage(state: BooksState, page: number) {
    state.currentPage = page
  },
  setHasMore(state: BooksState, hasMore: boolean) {
    state.hasMore = hasMore
  },
  SET_FILTERS(state: BooksState, filters: typeof state.filters) {
    state.filters = {
      ...state.filters,
      search: filters.search || null,
      category: filters.category || null,
      language: filters.language || null,
      minPrice: filters.minPrice ? Number(filters.minPrice) : null,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
      minYear: filters.minYear ? Number(filters.minYear) : null,
      maxYear: filters.maxYear ? Number(filters.maxYear) : null,
      minPages: filters.minPages ? Number(filters.minPages) : null,
      maxPages: filters.maxPages ? Number(filters.maxPages) : null,
      isFree: filters.isFree,
      rating: filters.rating
    }
  },
  setNewBook(state: BooksState, book: BooksState['newBook']) {
    state.newBook = book
  },
  updateNewBook(state: BooksState, updates: Partial<NonNullable<BooksState['newBook']>>) {
    if (state.newBook) {
      state.newBook = { ...state.newBook, ...updates }
    } else {
      state.newBook = {
        title: '',
        author: '',
        description: '',
        price: 0,
        coverImage: '',
        category: '',
        language: '',
        pageCount: 0,
        publishYear: new Date().getFullYear(),
        isFree: false,
        ...updates
      }
    }
  },
  clearNewBook(state: BooksState) {
    state.newBook = null
  }
}

const actions = {
  async initialize({ dispatch }: BooksActionContext) {
    await dispatch('fetchBooks')
    await dispatch('fetchUserFavorites') // Favorileri yükle
  },

  async fetchBooks({ commit, state, rootState }: BooksActionContext) {
    try {
      commit('setLoading', true)
      commit('setError', null)

      // Simüle edilmiş API çağrısı
      const response = await new Promise<Book[]>((resolve) => {
        setTimeout(() => {
          const categories = ['Roman', 'Bilim Kurgu', 'Fantastik', 'Kişisel Gelişim', 'Tarih']
          const languages = ['Türkçe', 'İngilizce', 'Almanca', 'Fransızca']
          const mockBooks: Book[] = Array.from({ length: state.itemsPerPage }, (_, index) => ({
            id: state.books.length + index + 1,
            title: `Kitap ${state.books.length + index + 1}`,
            author: `Yazar ${state.books.length + index + 1}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            price: Math.floor(Math.random() * 200) + 20,
            coverImage: `/images/books/placeholder.jpg`,
            rating: (Math.floor(Math.random() * 10) + 35) / 10,
            publishDate: new Date().toISOString(),
            category: categories[Math.floor(Math.random() * categories.length)],
            language: languages[Math.floor(Math.random() * languages.length)],
            pageCount: Math.floor(Math.random() * 500) + 100,
            publishYear: Math.floor(Math.random() * 30) + 1990,
            isFree: Math.random() > 0.9,
            userId: 999,
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

      commit('setHasMore', state.currentPage < 5)
      commit('setCurrentPage', state.currentPage + 1)
    } catch (error) {
      commit('setError', 'Kitaplar yüklenirken bir hata oluştu')
    } finally {
      commit('setLoading', false)
    }
  },

  async fetchUserBooks({ commit, rootState, state }: BooksActionContext) {
    try {
      commit('setLoading', true)
      commit('setError', null)

      // Kullanıcı giriş yapmış mı kontrol et
      const userId = rootState.auth?.user?.id
      if (!userId) {
        commit('setUserBooks', [])
        return
      }

      // Sadece kullanıcının kendi kitaplarını filtrele
      const userBooks = state.books.filter(book => book.userId === userId)
      commit('setUserBooks', userBooks)
      commit('setBooks', userBooks)
    } catch (error) {
      commit('setError', 'Kitaplarınız yüklenirken bir hata oluştu')
    } finally {
      commit('setLoading', false)
    }
  },

  async fetchUserFavorites({ commit, state }: { commit: Commit, state: BooksState }) {
    commit('setLoading', true)
    commit('setError', null)

    try {
      // LocalStorage'dan favori kitapları al
      const savedFavorites = localStorage.getItem('userFavorites')
      const favorites = savedFavorites ? JSON.parse(savedFavorites) : []
      
      // Ana kitap listesini güncelle
      state.books = state.books.map(book => ({
        ...book,
        isFavorite: favorites.some((fav: Book) => fav.id === book.id)
      }))
      
      // Favori listesini güncelle
      commit('setUserFavorites', favorites)
    } catch (error) {
      commit('setError', 'Favoriler yüklenirken bir hata oluştu')
    } finally {
      commit('setLoading', false)
    }
  },

  async addBook({ commit, rootState }: BooksActionContext, bookData: Partial<Book>) {
    try {
      commit('setLoading', true)
      commit('setError', null)

      // Simüle edilmiş API çağrısı
      const newBook = await new Promise<Book>((resolve) => {
        setTimeout(() => {
          const book: Book = {
            id: Math.floor(Math.random() * 10000) + 1,
            userId: rootState.auth?.user?.id || 1,
            isFavorite: false,
            ...bookData
          } as Book
          resolve(book)
        }, 500)
      })

      commit('addBook', newBook)
    } catch (error) {
      commit('setError', 'Kitap eklenirken bir hata oluştu')
      throw error
    } finally {
      commit('setLoading', false)
    }
  },

  async updateBook({ commit }: { commit: Commit }, book: Book) {
    commit('setLoading', true)
    commit('setError', null)

    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      commit('updateBook', book)
      return book
    } catch (error) {
      commit('setError', 'Kitap güncellenirken bir hata oluştu')
      throw error
    } finally {
      commit('setLoading', false)
    }
  },

  async deleteBook({ commit }: { commit: Commit }, bookId: number) {
    commit('setLoading', true)
    commit('setError', null)

    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      commit('deleteBook', bookId)
    } catch (error) {
      commit('setError', 'Kitap silinirken bir hata oluştu')
      throw error
    } finally {
      commit('setLoading', false)
    }
  },

  async toggleFavorite({ commit, state }: { commit: Commit, state: BooksState }, bookId: number) {
    try {
      commit('toggleFavorite', bookId)
      
      // Favori durumunu güncelle
      const book = state.books.find(b => b.id === bookId)
      if (book) {
        // Diğer bileşenleri haberdar et
        commit('setUserFavorites', state.userFavorites)
      }
    } catch (error) {
      console.error('Favori durumu güncellenirken hata:', error)
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