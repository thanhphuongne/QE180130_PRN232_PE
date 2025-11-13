'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { postService, UpdatePostDto } from '@/lib/api'

interface EditPostFormProps {
  postId: number
}

export default function EditPostForm({ postId }: EditPostFormProps) {
  const [formData, setFormData] = useState<UpdatePostDto>({
    name: '',
    description: '',
    imageUrl: ''
  })
  const [errors, setErrors] = useState<Partial<UpdatePostDto>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const post = await postService.getPostById(postId)
      setFormData({
        name: post.name,
        description: post.description,
        imageUrl: post.imageUrl || ''
      })
    } catch (error) {
      console.error('Error fetching post:', error)
      alert('Failed to fetch post. Redirecting to home page.')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name as keyof UpdatePostDto]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<UpdatePostDto> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    try {
      setSubmitting(true)
      await postService.updatePost(postId, formData)
      router.push('/')
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-2xl text-blue-600 font-semibold">Loading post...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6 border-2 border-blue-100">
        <div>
          <label htmlFor="name" className="block text-lg font-bold text-gray-800 mb-3">
            📝 Post Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter post name"
            maxLength={200}
            className="w-full px-5 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 text-lg"
          />
          {errors.name && <p className="mt-2 text-base text-red-600 font-semibold">⚠️ {errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-bold text-gray-800 mb-3">
            📄 Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter post description"
            maxLength={2000}
            rows={6}
            className="w-full px-5 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 text-lg resize-vertical"
          />
          {errors.description && <p className="mt-2 text-base text-red-600 font-semibold">⚠️ {errors.description}</p>}
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-lg font-bold text-gray-800 mb-3">
            🖼️ Image URL (Optional)
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            maxLength={500}
            className="w-full px-5 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 text-lg"
          />
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
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 font-bold text-lg shadow-md"
          >
            {submitting ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
