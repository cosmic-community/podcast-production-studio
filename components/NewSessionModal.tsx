'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaTimes, FaSpinner } from 'react-icons/fa'

interface NewSessionModalProps {
  isOpen: boolean
  onClose: () => void
  episodes: any[]
  participants: any[]
}

export default function NewSessionModal({ isOpen, onClose, episodes, participants }: NewSessionModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    episode: '',
    session_date: '',
    duration: '60',
    participants: [] as string[],
    recording_quality: 'high',
    session_notes: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          type: 'recording-sessions',
          metadata: {
            title: formData.title,
            episode: formData.episode,
            session_date: formData.session_date,
            duration: parseInt(formData.duration),
            participants: formData.participants,
            recording_quality: { 
              key: formData.recording_quality, 
              value: formData.recording_quality === 'high' ? 'High (48kHz/24bit)' : 
                     formData.recording_quality === 'broadcast' ? 'Broadcast Quality' : 'Standard'
            },
            status: { key: 'scheduled', value: 'Scheduled' },
            session_notes: formData.session_notes
          }
        })
      })

      if (response.ok) {
        const session = await response.json()
        onClose()
        router.push(`/sessions/${session.id}/record`)
        router.refresh()
      } else {
        throw new Error('Failed to create session')
      }
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Failed to create session. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleParticipantToggle = (participantId: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(participantId)
        ? prev.participants.filter(id => id !== participantId)
        : [...prev.participants, participantId]
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Schedule Recording Session</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Session Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Recording session title"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="episode" className="block text-sm font-medium text-gray-700 mb-2">
              Related Episode
            </label>
            <select
              id="episode"
              value={formData.episode}
              onChange={(e) => setFormData(prev => ({ ...prev, episode: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="">Select episode (optional)</option>
              {episodes.map((episode) => (
                <option key={episode.id} value={episode.id}>
                  {episode.metadata?.episode_number ? `#${episode.metadata.episode_number} - ` : ''}{episode.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="session_date" className="block text-sm font-medium text-gray-700 mb-2">
                Session Date & Time *
              </label>
              <input
                type="datetime-local"
                id="session_date"
                value={formData.session_date}
                onChange={(e) => setFormData(prev => ({ ...prev, session_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="15"
                max="480"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="recording_quality" className="block text-sm font-medium text-gray-700 mb-2">
              Recording Quality
            </label>
            <select
              id="recording_quality"
              value={formData.recording_quality}
              onChange={(e) => setFormData(prev => ({ ...prev, recording_quality: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="standard">Standard Quality</option>
              <option value="high">High (48kHz/24bit)</option>
              <option value="broadcast">Broadcast Quality</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants *
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {participants.map((participant) => (
                <label key={participant.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.participants.includes(participant.id)}
                    onChange={() => handleParticipantToggle(participant.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    disabled={isSubmitting}
                  />
                  <div className="flex items-center space-x-2">
                    {participant.metadata?.avatar?.imgix_url ? (
                      <img
                        src={`${participant.metadata.avatar.imgix_url}?w=48&h=48&fit=crop&auto=format,compress`}
                        alt={participant.title}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                        {participant.title?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-gray-700">{participant.title}</span>
                  </div>
                </label>
              ))}
            </div>
            {formData.participants.length === 0 && (
              <p className="text-sm text-red-600 mt-1">Please select at least one participant</p>
            )}
          </div>

          <div>
            <label htmlFor="session_notes" className="block text-sm font-medium text-gray-700 mb-2">
              Session Notes
            </label>
            <textarea
              id="session_notes"
              value={formData.session_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, session_notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Pre-recording notes, talking points, technical requirements..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={isSubmitting || formData.participants.length === 0}
            >
              {isSubmitting && <FaSpinner className="w-4 h-4 animate-spin" />}
              Schedule Session
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}