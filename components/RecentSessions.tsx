import Link from 'next/link'
import { getRecordingSessions } from '@/lib/cosmic'
import { FaMicrophone, FaClock, FaUsers, FaArrowRight } from 'react-icons/fa'
import { getStatusValue } from '@/types'

export default async function RecentSessions() {
  const allSessions = await getRecordingSessions()
  const recentSessions = allSessions.slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'live':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (recentSessions.length === 0) {
    return (
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FaMicrophone className="w-5 h-5 text-red-600" />
            Recent Recording Sessions
          </h2>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMicrophone className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recording Sessions</h3>
          <p className="text-gray-600 mb-4">Create your first recording session to get started.</p>
          <Link href="/sessions" className="btn-primary inline-flex items-center gap-2">
            <FaMicrophone className="w-4 h-4" />
            Go to Sessions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FaMicrophone className="w-5 h-5 text-red-600" />
            Recent Recording Sessions
          </h2>
          <Link href="/sessions" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View all
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {recentSessions.map((session) => {
          const status = getStatusValue(session.metadata?.status, 'scheduled')
          const sessionDate = session.metadata?.session_date
          const participants = session.metadata?.participants || []

          return (
            <Link
              key={session.id}
              href={status === 'scheduled' || status === 'live' ? `/sessions/${session.id}/record` : `/sessions/${session.id}`}
              className="block p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900">{session.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaClock className="w-3 h-3 text-gray-400" />
                  <span>
                    {sessionDate 
                      ? new Date(sessionDate).toLocaleDateString()
                      : 'Not scheduled'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="w-3 h-3 text-gray-400" />
                  <span>{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              {(status === 'scheduled' || status === 'live') && (
                <div className="mt-3">
                  <span className="inline-flex items-center gap-2 text-sm text-red-600 font-medium">
                    <FaMicrophone className={`w-4 h-4 ${status === 'live' ? 'animate-pulse' : ''}`} />
                    {status === 'live' ? 'Continue Recording' : 'Start Recording'}
                  </span>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}