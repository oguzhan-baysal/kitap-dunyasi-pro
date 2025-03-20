import { Module, Commit } from 'vuex'
import { RootState } from '../types'

interface Comment {
  id: number
  bookId: number
  userId: number
  username: string
  content: string
  rating: number
  createdAt: string
}

interface CommentsState {
  comments: Comment[]
  loading: boolean
  error: string | null
}

const state = (): CommentsState => ({
  comments: [],
  loading: false,
  error: null
})

const getters = {
  getBookComments: (state: CommentsState) => (bookId: number) => {
    return state.comments.filter(comment => comment.bookId === bookId)
  },
  isLoading: (state: CommentsState) => state.loading,
  getError: (state: CommentsState) => state.error
}

const mutations = {
  setComments(state: CommentsState, comments: Comment[]) {
    state.comments = comments
  },
  addComment(state: CommentsState, comment: Comment) {
    state.comments.push(comment)
  },
  setLoading(state: CommentsState, loading: boolean) {
    state.loading = loading
  },
  setError(state: CommentsState, error: string | null) {
    state.error = error
  }
}

const actions = {
  async fetchBookComments({ commit }: { commit: Commit }, bookId: number) {
    try {
      commit('setLoading', true)
      commit('setError', null)

      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockComments: Comment[] = [
        {
          id: 1,
          bookId,
          userId: 1,
          username: "Ahmet Yılmaz",
          content: "Harika bir kitap, kesinlikle tavsiye ederim!",
          rating: 5,
          createdAt: "2024-03-20T10:30:00Z"
        },
        {
          id: 2,
          bookId,
          userId: 2,
          username: "Ayşe Demir",
          content: "Çok etkileyici bir anlatımı var.",
          rating: 4,
          createdAt: "2024-03-19T15:45:00Z"
        }
      ]

      commit('setComments', mockComments)
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error)
      commit('setError', 'Yorumlar yüklenirken bir hata oluştu')
    } finally {
      commit('setLoading', false)
    }
  },

  async addComment({ commit }: { commit: Commit }, comment: Omit<Comment, 'id' | 'createdAt'>) {
    try {
      commit('setLoading', true)
      commit('setError', null)

      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 500))

      const newComment: Comment = {
        ...comment,
        id: Math.floor(Math.random() * 1000) + 1,
        createdAt: new Date().toISOString()
      }

      commit('addComment', newComment)
    } catch (error) {
      console.error('Yorum eklenirken hata:', error)
      commit('setError', 'Yorum eklenirken bir hata oluştu')
      throw error
    } finally {
      commit('setLoading', false)
    }
  }
}

export const comments: Module<CommentsState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 