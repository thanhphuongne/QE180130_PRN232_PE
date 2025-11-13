'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { movieService, CreateMovieDto } from '@/lib/api'

export default function CreateMovieForm() {
  const [formData, setFormData] = useState<CreateMovieDto>({
    title: '',
    genre: '',
    rating: undefined,
    posterUrl: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CreateMovieDto, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? (value ? parseInt(value) : undefined) : value
    }))
    if (errors[name as keyof CreateMovieDto]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateMovieDto, string>> = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (formData.rating && (formData.rating < 1 || formData.rating > 5)) {
      newErrors.rating = 'Rating must be between 1 and 5'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    try {
      setSubmitting(true)
      const dataToSubmit = {
        ...formData,
        genre: formData.genre?.trim() || undefined,
        posterUrl: formData.posterUrl?.trim() || undefined
      }
      await movieService.createMovie(dataToSubmit)
      toast.success('🎬 Movie created successfully!')
      router.push('/')
    } catch (error) {
      console.error('Error creating movie:', error)
      toast.error('Failed to create movie. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6 border-2 border-blue-100">
        <div>
          <label htmlFor="title" className="block text-lg font-bold text-gray-800 mb-3">
            🎬 Movie Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter movie title"
            maxLength={200}
            className="w-full px-5 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 text-lg"
          />
          {errors.title && <p className="mt-2 text-base text-red-600 font-semibold">⚠️ {errors.title}</p>}
        </div>

        <div>
          <label htmlFor="genre" className="block text-lg font-bold text-gray-800 mb-3">
            🎭 Genre (Optional)
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="e.g., Action, Comedy, Drama"
            maxLength={100}
            className="w-full px-5 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 text-lg"
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-lg font-bold text-gray-800 mb-3">
            ⭐ Rating (Optional, 1-5)
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating || ''}
            onChange={handleChange}
            className="w-full px-5 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 text-lg bg-white cursor-pointer"
          >
            <option value="">No rating</option>
            <option value="1">⭐ 1 - Poor</option>
            <option value="2">⭐⭐ 2 - Fair</option>
            <option value="3">⭐⭐⭐ 3 - Good</option>
            <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
          </select>
          {errors.rating && <p className="mt-2 text-base text-red-600 font-semibold">⚠️ {errors.rating}</p>}
        </div>

        <div>
          <label htmlFor="posterUrl" className="block text-lg font-bold text-gray-800 mb-3">
            🖼️ Poster URL (Optional)
          </label>
          <input
            type="url"
            id="posterUrl"
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleChange}
            placeholder="https://example.com/poster.jpg"
            maxLength={500}
            className="w-full px-5 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 text-lg"
          />
          {formData.posterUrl && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img 
                src={formData.posterUrl} 
                alt="Poster preview" 
                className="w-32 h-48 object-cover rounded-lg border-2 border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all disabled:opacity-50 font-bold text-lg shadow-md"
          >
            ❌ Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 font-bold text-lg shadow-md"
          >
            {submitting ? '⏳ Creating...' : '✅ Add Movie'}
          </button>
        </div>
      </div>
    </form>
  )
}
