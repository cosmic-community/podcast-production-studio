import { Suspense } from 'react'
import DashboardStats from '@/components/DashboardStats'
import RecentEpisodes from '@/components/RecentEpisodes'
import RecentSessions from '@/components/RecentSessions'
import QualityReviews from '@/components/QualityReviews'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Podcast Production Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Monitor your podcast production workflow and track episode progress
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="space-y-8">
          <Suspense fallback={<LoadingSpinner />}>
            <RecentEpisodes />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner />}>
            <QualityReviews />
          </Suspense>
        </div>
        
        <div>
          <Suspense fallback={<LoadingSpinner />}>
            <RecentSessions />
          </Suspense>
        </div>
      </div>
    </div>
  )
}