import { Suspense } from 'react'
import EpisodeList from '@/components/EpisodeList'
import LoadingSpinner from '@/components/LoadingSpinner'
import NewEpisodeButton from '@/components/NewEpisodeButton'

export default function EpisodesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Episodes</h1>
          <p className="mt-2 text-gray-600">
            Manage your podcast episodes and track production status
          </p>
        </div>
        
        <NewEpisodeButton />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <EpisodeList />
      </Suspense>
    </div>
  )
}