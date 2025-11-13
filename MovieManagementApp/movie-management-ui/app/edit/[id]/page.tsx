import EditMovieForm from '@/components/EditMovieForm'

interface EditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params
  const movieId = parseInt(id, 10)

  return (
    <div>
      <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border-2 border-blue-100">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          ✏️ Edit Movie
        </h2>
        <p className="text-gray-700 text-lg font-medium">Update the movie details below</p>
      </div>
      <EditMovieForm movieId={movieId} />
    </div>
  )
}
