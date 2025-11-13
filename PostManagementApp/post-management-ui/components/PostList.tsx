'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { postService, Post } from '@/lib/api'
import DeleteModal from './DeleteModal'

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const router = useRouter()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchPosts()
  }, [debouncedSearchTerm, sortOrder])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await postService.getAllPosts(debouncedSearchTerm, sortOrder)
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      alert('Failed to fetch posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`)
  }

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return
    
    try {
      await postService.deletePost(postToDelete.id)
      setPosts(posts.filter(p => p.id !== postToDelete.id))
      setDeleteModalOpen(false)
      setPostToDelete(null)
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setPostToDelete(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-2xl text-blue-600 font-semibold">Loading posts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            type="text"
            placeholder="🔍 Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 cursor-pointer"
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow border border-gray-200">
          <p className="text-gray-600 text-lg">
            {searchTerm ? '🔍 No posts found matching your search.' : '📝 No posts available. Create your first post!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-1">{post.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{post.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(post.id)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(post)}
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

      {deleteModalOpen && postToDelete && (
        <DeleteModal
          postName={postToDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  )
}
