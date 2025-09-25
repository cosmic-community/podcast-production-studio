import { Suspense } from 'react'
import SessionList from '@/components/SessionList'
import LoadingSpinner from '@/components/LoadingSpinner'
import NewSessionButton from '@/components/NewSessionButton'

export default function SessionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recording Sessions</h1>
          <p className="mt-2 text-gray-600">
            Schedule and manage collaborative recording sessions
          </p>
        </div>
        
        <NewSessionButton />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <SessionList />
      </Suspense>
    </div>
  )
}