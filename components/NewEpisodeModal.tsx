'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaTimes, FaSpinner } from 'react-icons/fa'

interface NewEpisodeModalProps {
  isOpen: boolean
  onClose: () => void
  podcastSeries: any[]
  participants: any[]
}

export default function NewEpisodeModal({ isOpen, onClose, podcastSeries, participants }: NewEpisodeModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    podcast_series: '',
    episode_number: '',
    description: '',
    participants: [] as string[],
    duration: '',
    publish_date: '',
    tags: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/episodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          type: 'episodes',
          metadata: {
            title: formData.title,
            podcast_series: formData.podcast_series,
            episode_number: parseInt(formData.episode_number) || 1,
            description: formData.description,
            participants: formData.participants,
            duration: formData.duration,
            publish_date: formData.publish_date,
            status: { key: 'draft', value: 'Draft' },
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          }
        })
      })

      if (response.ok) {
        const episode = await response.json()
        onClose()
        router.push(`/episodes/${episode.slug}`)
        router.refresh()
      } else {
        throw new Error('Failed to create episode')
      }
    } catch (error) {
      console.error('Error creating episode:', error)
      alert('Failed to create episode. Please try again.')
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
          <h2 className="text-xl font-semibold text-gray-900">Create New Episode</h2>
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
              Episode Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter episode title"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="podcast_series" className="block text-sm font-medium text-gray-700 mb-2">
                Podcast Series
              </label>
              <select
                id="podcast_series"
                value={formData.podcast_series}
                onChange={(e) => setFormData(prev => ({ ...prev, podcast_series: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="">Select series</option>
                {podcastSeries.map((series) => (
                  <option key={series.id} value={series.id}>
                    {series.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="episode_number" className="block text-sm font-medium text-gray-700 mb-2">
                Episode Number
              </label>
              <input
                type="number"
                id="episode_number"
                value={formData.episode_number}
                onChange={(e) => setFormData(prev => ({ ...prev, episode_number: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="1"
                min="1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Episode description..."
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Duration
              </label>
              <input
                type="text"
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="45:00"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="publish_date" className="block text-sm font-medium text-gray-700 mb-2">
                Publish Date
              </label>
              <input
                type="date"
                id="publish_date"
                value={formData.publish_date}
                onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="interview, technology, discussion"
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
              disabled={isSubmitting}
            >
              {isSubmitting && <FaSpinner className="w-4 h-4 animate-spin" />}
              Create Episode
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}