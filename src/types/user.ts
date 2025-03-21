export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface UserState {
  currentUser: User | null
  loading: boolean
  error: string | null
} 