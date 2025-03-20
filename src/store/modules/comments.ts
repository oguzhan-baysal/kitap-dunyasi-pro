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

export interface CommentsState {
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
    commit('setLoading', true)
    commit('setError', null)

    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockComments: Comment[] = [
        {
          id: 1,
          bookId: bookId,
          userId: 1,
          username: 'John Doe',
          content: 'Harika bir kitap!',
          rating: 5,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          bookId: bookId,
          userId: 2,
          username: 'Jane Smith',
          content: 'Çok etkileyici.',
          rating: 4,
          createdAt: new Date().toISOString()
        }
      ]

      commit('setComments', mockComments)
    } catch (error) {
      commit('setError', 'Yorumlar yüklenirken bir hata oluştu')
    } finally {
      commit('setLoading', false)
    }
  },

  async addComment({ commit }: { commit: Commit }, comment: Omit<Comment, 'id' | 'createdAt'>) {
    commit('setLoading', true)
    commit('setError', null)

    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newComment: Comment = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...comment
      }

      commit('addComment', newComment)
      return newComment
    } catch (error) {
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