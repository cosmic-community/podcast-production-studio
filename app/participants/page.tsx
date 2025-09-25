import { Suspense } from 'react'
import ParticipantList from '@/components/ParticipantList'
import LoadingSpinner from '@/components/LoadingSpinner'
import { FaPlus } from 'react-icons/fa'

export default function ParticipantsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Participants</h1>
          <p className="mt-2 text-gray-600">
            Manage hosts, guests, and podcast team members
          </p>
        </div>
        
        <button className="btn-primary flex items-center gap-2">
          <FaPlus className="w-4 h-4" />
          Add Participant
        </button>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ParticipantList />
      </Suspense>
    </div>
  )
}