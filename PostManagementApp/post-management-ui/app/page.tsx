import PostList from '@/components/PostList'

export default function Home() {
  return (
    <div>
      <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border-2 border-blue-100">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          📚 All Posts
        </h2>
        <p className="text-gray-700 text-lg font-medium">Browse, search, and manage your posts</p>
      </div>
      <PostList />
    </div>
  )
}
