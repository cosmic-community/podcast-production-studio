import { getRecordingSessions } from '@/lib/cosmic'
import SessionList from '@/components/SessionList'
import NewSessionButton from '@/components/NewSessionButton'
import { FaMicrophone } from 'react-icons/fa'

export const revalidate = 60

export default async function SessionsPage() {
  const sessions = await getRecordingSessions()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaMicrophone className="w-8 h-8 text-blue-600" />
            Recording Sessions
          </h1>
          <p className="text-gray-600 mt-2">
            Schedule and manage your podcast recording sessions
          </p>
        </div>
        <NewSessionButton />
      </div>

      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Quick Start Recording:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>1. Create a new session or select an existing scheduled session</li>
          <li>2. Click "Start Recording" to begin</li>
          <li>3. Allow microphone access when prompted</li>
          <li>4. Use the recording controls to pause/resume/stop</li>
          <li>5. Your recording will be automatically saved to Cosmic CMS</li>
        </ul>
      </div>

      <SessionList sessions={sessions} />
    </div>
  )
}