import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Movie {
  id: number
  title: string
  genre?: string
  rating?: number
  posterUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreateMovieDto {
  title: string
  genre?: string
  rating?: number
  posterUrl?: string
}

export interface UpdateMovieDto {
  title: string
  genre?: string
  rating?: number
  posterUrl?: string
}

export const movieService = {
  getAllMovies: async (search = '', genre = '', sortBy = 'title', sortOrder = 'asc'): Promise<Movie[]> => {
    const response = await api.get('/movies', {
      params: {
        search,
        genre,
        sortBy,
        sortOrder
      }
    })
    return response.data
  },

  getGenres: async (): Promise<string[]> => {
    const response = await api.get('/movies/genres')
    return response.data
  },

  getMovieById: async (id: number): Promise<Movie> => {
    const response = await api.get(`/movies/${id}`)
    return response.data
  },

  createMovie: async (movieData: CreateMovieDto): Promise<Movie> => {
    const response = await api.post('/movies', movieData)
    return response.data
  },

  updateMovie: async (id: number, movieData: UpdateMovieDto): Promise<Movie> => {
    const response = await api.put(`/movies/${id}`, movieData)
    return response.data
  },

  deleteMovie: async (id: number): Promise<void> => {
    await api.delete(`/movies/${id}`)
  },
}

export default api
