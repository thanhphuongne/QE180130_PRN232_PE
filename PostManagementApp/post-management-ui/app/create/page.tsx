import CreatePostForm from '@/components/CreatePostForm'

export default function CreatePage() {
  return (
    <div>
      <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border-2 border-blue-100">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          ✨ Create New Post
        </h2>
        <p className="text-gray-700 text-lg font-medium">Fill in the details to create a new post</p>
      </div>
      <CreatePostForm />
    </div>
  )
}
