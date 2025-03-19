// @ts-ignore
import { Module, Commit } from 'vuex'
import { RootState, BooksState, Book } from '../types'

const state = (): BooksState => ({
  books: [],
  loading: false,
  error: null,
  selectedBook: null,
  filters: {
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    searchQuery: ''
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
  getSelectedBook: (state: BooksState): Book | null => state.selectedBook,
  getFilters: (state: BooksState) => state.filters,
  getSort: (state: BooksState) => state.sort,
  
  featuredBooks: (state: BooksState): Book[] => {
    return state.books.filter(book => book.rating >= 4.0).slice(0, 5)
  },

  getFilteredBooks: (state: BooksState): Book[] => {
    return state.books.filter(book => {
      // Kategori filtresi
      if (state.filters.category && book.category !== state.filters.category) {
        return false
      }

      // Fiyat aralığı filtresi
      if (book.price < state.filters.minPrice || 
          book.price > state.filters.maxPrice) {
        return false
      }

      // Arama filtresi
      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase()
        const searchIn = [
          book.title,
          book.author,
          book.description,
          book.category
        ].map(text => text.toLowerCase())

        return searchIn.some(text => text.includes(query))
      }

      return true
    }).sort((a, b) => {
      const field = state.sort.field as keyof Book
      const order = state.sort.order === 'asc' ? 1 : -1
      const aValue = a[field]
      const bValue = b[field]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * order
      }
      
      if (aValue === undefined || bValue === undefined) return 0
      return aValue > bValue ? order : -order
    })
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
  SET_SELECTED_BOOK(state: BooksState, book: Book | null) {
    state.selectedBook = book
  },
  UPDATE_FILTERS(state: BooksState, filters: Partial<BooksState['filters']>) {
    state.filters = { ...state.filters, ...filters }
  },
  UPDATE_SORT(state: BooksState, sort: BooksState['sort']) {
    state.sort = sort
  }
}

const actions = {
  async initialize({ commit }: { commit: Commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      // Mock kitap verisi
      const mockBooks: Book[] = [
        {
          id: 1,
          title: 'Suç ve Ceza',
          author: 'Fyodor Dostoyevski',
          description: 'Rus edebiyatının en önemli eserlerinden biri. Raskolnikov\'un psikolojik gerilimi...',
          price: 49.90,
          rating: 4.8,
          category: 'Roman',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 2,
          title: '1984',
          author: 'George Orwell',
          description: 'Distopik bir gelecekte geçen, gözetim toplumunu eleştiren başyapıt...',
          price: 39.90,
          rating: 4.7,
          category: 'Roman',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 3,
          title: 'Dönüşüm',
          author: 'Franz Kafka',
          description: 'Bir sabah Gregor Samsa kendini dev bir böceğe dönüşmüş olarak bulur...',
          price: 29.90,
          rating: 4.6,
          category: 'Roman',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 4,
          title: 'Sefiller',
          author: 'Victor Hugo',
          description: 'Jean Valjean\'ın hikayesi üzerinden adalet ve merhamet kavramlarını sorgulayan başyapıt...',
          price: 69.90,
          rating: 4.9,
          category: 'Roman',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 5,
          title: 'Küçük Prens',
          author: 'Antoine de Saint-Exupéry',
          description: 'Çocuklar için yazılmış gibi görünen ama aslında yetişkinlere çok şey anlatan bir klasik...',
          price: 24.90,
          rating: 4.8,
          category: 'Çocuk',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 6,
          title: 'Sapiens',
          author: 'Yuval Noah Harari',
          description: 'İnsanlığın tarihsel yolculuğunu anlatan çığır açıcı bir eser...',
          price: 59.90,
          rating: 4.7,
          category: 'Bilim',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 7,
          title: 'Atomik Alışkanlıklar',
          author: 'James Clear',
          description: 'Küçük değişikliklerle büyük sonuçlar elde etmenin bilimsel yolu...',
          price: 44.90,
          rating: 4.6,
          category: 'Kişisel Gelişim',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 8,
          title: 'Nutuk',
          author: 'Mustafa Kemal Atatürk',
          description: 'Türkiye Cumhuriyeti\'nin kuruluş destanı...',
          price: 34.90,
          rating: 5.0,
          category: 'Tarih',
          imageUrl: '/placeholder.svg'
        }
      ]

      commit('SET_BOOKS', mockBooks)
    } catch (error) {
      console.error('Books initialization error:', error)
      commit('SET_ERROR', 'Kitaplar yüklenirken bir hata oluştu')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchBooks({ commit }: { commit: Commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      // Mock kitap verisi - initialize ile aynı veri
      const mockBooks: Book[] = [
        {
          id: 1,
          title: 'Suç ve Ceza',
          author: 'Fyodor Dostoyevski',
          description: 'Rus edebiyatının en önemli eserlerinden biri. Raskolnikov\'un psikolojik gerilimi...',
          price: 49.90,
          rating: 4.8,
          category: 'Roman',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 2,
          title: '1984',
          author: 'George Orwell',
          description: 'Distopik bir gelecekte geçen, gözetim toplumunu eleştiren başyapıt...',
          price: 39.90,
          rating: 4.7,
          category: 'Roman',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 3,
          title: 'Dönüşüm',
          author: 'Franz Kafka',
          description: 'Bir sabah Gregor Samsa kendini dev bir böceğe dönüşmüş olarak bulur...',
          price: 29.90,
          rating: 4.6,
          category: 'Roman',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 4,
          title: 'Sefiller',
          author: 'Victor Hugo',
          description: 'Jean Valjean\'ın hikayesi üzerinden adalet ve merhamet kavramlarını sorgulayan başyapıt...',
          price: 69.90,
          rating: 4.9,
          category: 'Roman',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 5,
          title: 'Küçük Prens',
          author: 'Antoine de Saint-Exupéry',
          description: 'Çocuklar için yazılmış gibi görünen ama aslında yetişkinlere çok şey anlatan bir klasik...',
          price: 24.90,
          rating: 4.8,
          category: 'Çocuk',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 6,
          title: 'Sapiens',
          author: 'Yuval Noah Harari',
          description: 'İnsanlığın tarihsel yolculuğunu anlatan çığır açıcı bir eser...',
          price: 59.90,
          rating: 4.7,
          category: 'Bilim',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 7,
          title: 'Atomik Alışkanlıklar',
          author: 'James Clear',
          description: 'Küçük değişikliklerle büyük sonuçlar elde etmenin bilimsel yolu...',
          price: 44.90,
          rating: 4.6,
          category: 'Kişisel Gelişim',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 8,
          title: 'Nutuk',
          author: 'Mustafa Kemal Atatürk',
          description: 'Türkiye Cumhuriyeti\'nin kuruluş destanı...',
          price: 34.90,
          rating: 5.0,
          category: 'Tarih',
          imageUrl: '/placeholder.svg'
        }
      ]

      commit('SET_BOOKS', mockBooks)
    } catch (error) {
      console.error('Books fetch error:', error)
      commit('SET_ERROR', 'Kitaplar yüklenirken bir hata oluştu')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  selectBook({ commit }: { commit: Commit }, book: Book | null) {
    commit('SET_SELECTED_BOOK', book)
  },

  updateFilters({ commit }: { commit: Commit }, filters: Partial<BooksState['filters']>) {
    commit('UPDATE_FILTERS', filters)
  },

  updateSort({ commit }: { commit: Commit }, sort: BooksState['sort']) {
    commit('UPDATE_SORT', sort)
  }
}

export const books: Module<BooksState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 