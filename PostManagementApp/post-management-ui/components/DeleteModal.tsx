'use client'

interface DeleteModalProps {
  postName: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteModal({ postName, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border-2 border-red-200">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900">Confirm Delete</h3>
          <p className="text-gray-800 text-lg font-medium">
            Are you sure you want to delete:
          </p>
          <p className="text-blue-600 text-xl font-bold mt-2">
            &quot;{postName}&quot;?
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all font-bold text-lg shadow-md"
          >
            ❌ Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all font-bold text-lg shadow-md"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  )
}
