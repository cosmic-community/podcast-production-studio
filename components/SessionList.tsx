import { getRecordingSessions } from '@/lib/cosmic'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import { RecordingSession } from '@/types'
import { FaVideo, FaClock, FaUsers, FaMicrophone } from 'react-icons/fa'

export default async function SessionList() {
  const sessions = await getRecordingSessions()

  if (sessions.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaVideo className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No recording sessions found</h3>
        <p className="text-gray-500 mb-4">Schedule your first collaborative recording session.</p>
        <button className="btn-primary">Schedule Session</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sessions.map((session: RecordingSession) => {
        const {
          title,
          metadata
        } = session

        const status = metadata?.status?.value || metadata?.status?.key || 'scheduled'
        const episode = metadata?.episode
        const sessionDate = metadata?.session_date
        const duration = metadata?.duration
        const participants = metadata?.participants || []
        const recordingQuality = metadata?.recording_quality
        const sessionNotes = metadata?.session_notes
        const technicalIssues = metadata?.technical_issues

        return (
          <div key={session.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FaVideo className="w-5 h-5 text-primary-600" />
                  <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                  <span className={`status-badge ${getStatusColor(status)}`}>
                    {typeof metadata?.status === 'object' 
                      ? metadata.status.value 
                      : status
                    }
                  </span>
                </div>

                {episode?.title && (
                  <p className="text-primary-600 mb-2">
                    Episode: {episode.title}
                  </p>
                )}

                {/* Session Details */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  {sessionDate && (
                    <div className="flex items-center gap-1">
                      <FaClock className="w-4 h-4" />
                      {formatDateTime(sessionDate)}
                    </div>
                  )}
                  
                  {duration && (
                    <div className="flex items-center gap-1">
                      <span>{duration} minutes</span>
                    </div>
                  )}
                  
                  {participants.length > 0 && (
                    <div className="flex items-center gap-1">
                      <FaUsers className="w-4 h-4" />
                      {participants.length} participant{participants.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  
                  {recordingQuality?.value && (
                    <div className="flex items-center gap-1">
                      <FaMicrophone className="w-4 h-4" />
                      {recordingQuality.value}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Participants */}
            {participants.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Participants:</h4>
                <div className="flex flex-wrap gap-2">
                  {participants.map((participant: any, index: number) => (
                    <div
                      key={participant.id || index}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                    >
                      {participant.metadata?.avatar?.imgix_url ? (
                        <img
                          src={`${participant.metadata.avatar.imgix_url}?w=48&h=48&fit=crop&auto=format,compress`}
                          alt={participant.title}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                          {(participant.title || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {participant.title}
                      </span>
                      {participant.metadata?.role?.value && (
                        <span className="text-xs text-gray-500">
                          ({participant.metadata.role.value})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session Notes */}
            {sessionNotes && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Session Notes:</h4>
                <div 
                  className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: sessionNotes }}
                />
              </div>
            )}

            {/* Technical Issues */}
            {technicalIssues && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-orange-700 mb-2">Technical Issues:</h4>
                <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                  {technicalIssues}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              {status === 'scheduled' && (
                <>
                  <button className="btn-primary">Start Recording</button>
                  <button className="btn-secondary">Edit Session</button>
                </>
              )}
              
              {status === 'completed' && (
                <>
                  <button className="btn-primary">View Recording</button>
                  <button className="btn-secondary">Edit Session</button>
                </>
              )}
              
              {status === 'live' && (
                <>
                  <button className="btn-danger">End Recording</button>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Recording in progress
                  </div>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}