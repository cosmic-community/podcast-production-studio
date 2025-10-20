'use client'

import Link from 'next/link'
import { RecordingSession, getStatusValue } from '@/types'
import { FaClock, FaUsers, FaMicrophone, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

interface SessionListProps {
  sessions: RecordingSession[]
}

export default function SessionList({ sessions }: SessionListProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'live':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <FaClock className="w-4 h-4" />
      case 'live':
        return <FaMicrophone className="w-4 h-4 animate-pulse" />
      case 'completed':
        return <FaCheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <FaTimesCircle className="w-4 h-4" />
      default:
        return <FaClock className="w-4 h-4" />
    }
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaMicrophone className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recording Sessions</h3>
        <p className="text-gray-600 mb-4">Create your first recording session to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const status = getStatusValue(session.metadata?.status, 'scheduled')
        const sessionDate = session.metadata?.session_date
        const participants = session.metadata?.participants || []
        const episode = session.metadata?.episode

        return (
          <div key={session.id} className="card hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {session.title}
                  </h3>
                  {episode?.title && (
                    <p className="text-sm text-gray-600 mb-2">
                      Episode: {episode.title}
                    </p>
                  )}
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock className="w-4 h-4 text-gray-400" />
                  <span>
                    {sessionDate 
                      ? new Date(sessionDate).toLocaleString()
                      : 'Not scheduled'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUsers className="w-4 h-4 text-gray-400" />
                  <span>
                    {participants.length} participant{participants.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {status === 'scheduled' && (
                  <Link
                    href={`/sessions/${session.id}/record`}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FaMicrophone className="w-4 h-4" />
                    Start Recording
                  </Link>
                )}
                {status === 'live' && (
                  <Link
                    href={`/sessions/${session.id}/record`}
                    className="btn-primary flex items-center gap-2 bg-red-600 hover:bg-red-700"
                  >
                    <FaMicrophone className="w-4 h-4 animate-pulse" />
                    Continue Recording
                  </Link>
                )}
                <Link
                  href={`/sessions/${session.id}`}
                  className="btn-secondary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}