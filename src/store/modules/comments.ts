import type { Module } from 'vuex'
import type { RootState, CommentsState, Comment } from '@/types'

const state: CommentsState = {
  comments: [],
  loading: false,
  error: null
}

const comments: Module<CommentsState, RootState> = {
  namespaced: true,
  state,
  getters: {
    getComments: (state) => state.comments,
    getBookComments: (state) => (bookId: number) => 
      state.comments.filter(comment => comment.bookId === bookId),
    getUserComments: (state) => (userId: number) =>
      state.comments.filter(comment => comment.userId === userId)
  },
  mutations: {
    SET_COMMENTS(state, comments: Comment[]) {
      state.comments = comments
    },
    ADD_COMMENT(state, comment: Comment) {
      state.comments.push(comment)
    },
    UPDATE_COMMENT(state, updatedComment: Comment) {
      const index = state.comments.findIndex(c => c.id === updatedComment.id)
      if (index !== -1) {
        state.comments.splice(index, 1, updatedComment)
      }
    },
    DELETE_COMMENT(state, commentId: number) {
      state.comments = state.comments.filter(c => c.id !== commentId)
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    }
  },
  actions: {
    async loadComments({ commit }) {
      commit('SET_LOADING', true)
      try {
        const storedComments = localStorage.getItem('comments')
        if (storedComments) {
          commit('SET_COMMENTS', JSON.parse(storedComments))
        }
      } catch (error) {
        commit('SET_ERROR', 'Yorumlar yüklenirken bir hata oluştu')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async addComment({ commit, state }, comment: Comment) {
      try {
        const newComment = {
          ...comment,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        commit('ADD_COMMENT', newComment)
        localStorage.setItem('comments', JSON.stringify(state.comments))
      } catch (error) {
        commit('SET_ERROR', 'Yorum eklenirken bir hata oluştu')
      }
    },

    async updateComment({ commit, state }, comment: Comment) {
      try {
        const updatedComment = {
          ...comment,
          updatedAt: new Date().toISOString()
        }
        
        commit('UPDATE_COMMENT', updatedComment)
        localStorage.setItem('comments', JSON.stringify(state.comments))
      } catch (error) {
        commit('SET_ERROR', 'Yorum güncellenirken bir hata oluştu')
      }
    },

    async deleteComment({ commit, state }, commentId: number) {
      try {
        commit('DELETE_COMMENT', commentId)
        localStorage.setItem('comments', JSON.stringify(state.comments))
      } catch (error) {
        commit('SET_ERROR', 'Yorum silinirken bir hata oluştu')
      }
    }
  }
}

export default comments 