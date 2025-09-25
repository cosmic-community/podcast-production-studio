'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import RecordingInterface from '@/components/RecordingInterface'
import LoadingSpinner from '@/components/LoadingSpinner'
import { RecordingSession } from '@/types'
import { FaArrowLeft, FaVideo, FaUsers, FaClock } from 'react-icons/fa'

export default function RecordingPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  
  const [session, setSession] = useState<RecordingSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`)
        if (!response.ok) {
          throw new Error('Session not found')
        }
        const data = await response.json()
        setSession(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load session')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [sessionId])

  const handleRecordingUpdate = async (data: any) => {
    try {
      // Update session status
      await fetch(`/api/sessions/${sessionId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: data.type,
          timestamp: data.timestamp,
          duration: data.duration
        })
      })

      // Handle recording completion
      if (data.type === 'recording_complete' && data.audioBlob) {
        const formData = new FormData()
        formData.append('audio', data.audioBlob, 'recording.webm')
        formData.append('sessionId', sessionId)
        formData.append('duration', data.duration.toString())

        await fetch('/api/recordings/upload', {
          method: 'POST',
          body: formData
        })
      }
    } catch (error) {
      console.error('Failed to update recording status:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !session) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaVideo className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Session Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The recording session could not be loaded.'}</p>
          <button
            onClick={() => router.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const episode = session.metadata?.episode
  const participants = session.metadata?.participants || []
  const sessionDate = session.metadata?.session_date
  const duration = session.metadata?.duration

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="btn-secondary flex items-center gap-2"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Sessions
        </button>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>
          {episode?.title && (
            <p className="text-gray-600 mt-1">
              Recording: {episode.title}
            </p>
          )}
        </div>
      </div>

      {/* Session Info */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <FaClock className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-700">Scheduled</div>
              <div className="text-gray-600">
                {sessionDate ? new Date(sessionDate).toLocaleString() : 'Not scheduled'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <FaUsers className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-700">Participants</div>
              <div className="text-gray-600">
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <FaVideo className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-700">Expected Duration</div>
              <div className="text-gray-600">
                {duration ? `${duration} minutes` : 'Not specified'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recording Interface */}
      <RecordingInterface
        sessionId={sessionId}
        participants={participants}
        onRecordingUpdate={handleRecordingUpdate}
      />
    </div>
  )
}