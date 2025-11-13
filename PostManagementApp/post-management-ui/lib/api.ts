import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Post {
  id: number
  name: string
  description: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePostDto {
  name: string
  description: string
  imageUrl?: string
}

export interface UpdatePostDto {
  name: string
  description: string
  imageUrl?: string
}

export const postService = {
  getAllPosts: async (search = '', sortOrder = 'asc'): Promise<Post[]> => {
    const response = await api.get('/posts', {
      params: {
        search,
        sortBy: 'name',
        sortOrder
      }
    })
    return response.data
  },

  getPostById: async (id: number): Promise<Post> => {
    const response = await api.get(`/posts/${id}`)
    return response.data
  },

  createPost: async (postData: CreatePostDto): Promise<Post> => {
    const response = await api.post('/posts', postData)
    return response.data
  },

  updatePost: async (id: number, postData: UpdatePostDto): Promise<Post> => {
    const response = await api.put(`/posts/${id}`, postData)
    return response.data
  },

  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`)
  },
}

export default api
