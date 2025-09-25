import { getRecordingSessions } from '@/lib/cosmic'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import { RecordingSession } from '@/types'
import { FaUsers, FaClock } from 'react-icons/fa'

export default async function RecentSessions() {
  const sessions = await getRecordingSessions()
  const recentSessions = sessions.slice(0, 5) as RecordingSession[]

  if (recentSessions.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h2>
        <p className="text-gray-500">No recording sessions found</p>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {recentSessions.map((session) => {
          const status = session.metadata?.status?.value || session.metadata?.status?.key || 'scheduled'
          const participants = session.metadata?.participants || []
          const episode = session.metadata?.episode
          const sessionDate = session.metadata?.session_date
          const duration = session.metadata?.duration

          return (
            <div key={session.id} className="border-l-4 border-primary-200 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{session.title}</h3>
                <span className={`status-badge ${getStatusColor(status)}`}>
                  {typeof session.metadata?.status === 'object' 
                    ? session.metadata.status.value 
                    : status
                  }
                </span>
              </div>
              
              {episode?.title && (
                <p className="text-sm text-primary-600 mb-2">
                  Episode: {episode.title}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {sessionDate && (
                  <div className="flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    {formatDateTime(sessionDate)}
                  </div>
                )}
                
                {participants.length > 0 && (
                  <div className="flex items-center gap-1">
                    <FaUsers className="w-3 h-3" />
                    {participants.length} participant{participants.length !== 1 ? 's' : ''}
                  </div>
                )}
                
                {duration && (
                  <span>{duration} minutes</span>
                )}
              </div>
              
              {participants.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-2">
                    {participants.slice(0, 3).map((participant: any, index: number) => (
                      <div
                        key={participant.id || index}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white"
                        title={participant.title || participant.metadata?.name}
                      >
                        {(participant.title || participant.metadata?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {participants.length > 3 && (
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                        +{participants.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}