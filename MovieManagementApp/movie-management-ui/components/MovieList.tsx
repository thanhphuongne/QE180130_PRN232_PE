'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { movieService, Movie } from '@/lib/api'
import DeleteModal from './DeleteModal'

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [sortBy, setSortBy] = useState<'title' | 'rating'>('title')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null)
  const router = useRouter()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchGenres()
  }, [])

  useEffect(() => {
    fetchMovies()
  }, [debouncedSearchTerm, selectedGenre, sortBy, sortOrder])

  const fetchGenres = async () => {
    try {
      const data = await movieService.getGenres()
      setGenres(data)
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const data = await movieService.getAllMovies(debouncedSearchTerm, selectedGenre, sortBy, sortOrder)
      setMovies(data)
    } catch (error) {
      console.error('Error fetching movies:', error)
      alert('Failed to fetch movies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`)
  }

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!movieToDelete) return
    
    try {
      await movieService.deleteMovie(movieToDelete.id)
      setMovies(movies.filter(m => m.id !== movieToDelete.id))
      setDeleteModalOpen(false)
      setMovieToDelete(null)
    } catch (error) {
      console.error('Error deleting movie:', error)
      alert('Failed to delete movie. Please try again.')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setMovieToDelete(null)
  }

  const renderStars = (rating?: number) => {
    if (!rating) return <span className="text-gray-400">No rating</span>
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
            ⭐
          </span>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-2xl text-blue-600 font-semibold">Loading movies...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col gap-3">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="🔍 Search movies by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          />
          
          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 cursor-pointer"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'rating')}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 cursor-pointer"
            >
              <option value="title">Sort by Title</option>
              <option value="rating">Sort by Rating</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 cursor-pointer"
            >
              <option value="asc">{sortBy === 'title' ? 'A-Z' : 'Low to High'}</option>
              <option value="desc">{sortBy === 'title' ? 'Z-A' : 'High to Low'}</option>
            </select>
          </div>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow border border-gray-200">
          <p className="text-gray-600 text-lg">
            {searchTerm || selectedGenre ? '🔍 No movies found matching your criteria.' : '🎬 No movies available. Add your first movie!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x400?text=No+Image'
                  }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">🎬</span>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-1">{movie.title}</h3>
                {movie.genre && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Genre:</span> {movie.genre}
                  </p>
                )}
                <div className="mb-4">
                  {renderStars(movie.rating)}
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleEdit(movie.id)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(movie)}
                    className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors font-medium"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteModalOpen && movieToDelete && (
        <DeleteModal
          movieTitle={movieToDelete.title}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  )
}
