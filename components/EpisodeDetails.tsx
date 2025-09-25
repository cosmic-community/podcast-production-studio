import Link from 'next/link'
import { formatDate, getStatusColor, getRoleColor, parseHtmlContent } from '@/lib/utils'
import { Episode } from '@/types'
import { FaArrowLeft, FaPlay, FaClock, FaCalendar, FaUsers, FaTag } from 'react-icons/fa'

interface EpisodeDetailsProps {
  episode: Episode;
}

export default function EpisodeDetails({ episode }: EpisodeDetailsProps) {
  const {
    title,
    metadata
  } = episode

  const status = metadata?.status?.value || metadata?.status?.key || 'draft'
  const episodeNumber = metadata?.episode_number
  const podcastSeries = metadata?.podcast_series
  const description = metadata?.description
  const showNotes = metadata?.show_notes
  const coverImage = metadata?.cover_image
  const duration = metadata?.duration
  const publishDate = metadata?.publish_date
  const participants = metadata?.participants || []
  const tags = metadata?.tags || []
  const transcript = metadata?.transcript

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/episodes" className="btn-secondary">
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Back to Episodes
        </Link>
      </div>

      {/* Episode Hero */}
      <div className="card p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cover Image */}
          <div className="flex-shrink-0">
            {coverImage?.imgix_url ? (
              <img
                src={`${coverImage.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`}
                alt={title}
                width={200}
                height={200}
                className="rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <FaPlay className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Episode Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              {episodeNumber && (
                <span className="text-lg font-medium text-gray-500">
                  Episode #{episodeNumber}
                </span>
              )}
              <span className={`status-badge ${getStatusColor(status)}`}>
                {typeof metadata?.status === 'object' 
                  ? metadata.status.value 
                  : status
                }
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

            {podcastSeries?.title && (
              <p className="text-lg text-primary-600 mb-4">
                {podcastSeries.title}
              </p>
            )}

            {/* Episode Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              {duration && (
                <div className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  <span>{duration}</span>
                </div>
              )}
              
              {publishDate && (
                <div className="flex items-center gap-2">
                  <FaCalendar className="w-4 h-4" />
                  <span>{formatDate(publishDate)}</span>
                </div>
              )}
              
              {participants.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaUsers className="w-4 h-4" />
                  <span>{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className="prose prose-gray max-w-none">
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 mt-8">
              <button className="btn-primary flex items-center gap-2">
                <FaPlay className="w-4 h-4" />
                Play Episode
              </button>
              <button className="btn-secondary">Edit Episode</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Show Notes */}
          {showNotes && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Show Notes</h2>
              <div className="prose prose-gray max-w-none">
                <div dangerouslySetInnerHTML={{ __html: showNotes }} />
              </div>
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Transcript</h2>
              <div className="prose prose-gray max-w-none">
                <div dangerouslySetInnerHTML={{ __html: transcript }} />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Participants */}
          {participants.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants</h3>
              <div className="space-y-4">
                {participants.map((participant: any, index: number) => (
                  <div key={participant.id || index} className="flex items-center gap-3">
                    {participant.metadata?.avatar?.imgix_url ? (
                      <img
                        src={`${participant.metadata.avatar.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                        alt={participant.title}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {(participant.title || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{participant.title}</p>
                      {participant.metadata?.role?.value && (
                        <span className={`inline-block mt-1 status-badge ${getRoleColor(participant.metadata.role.key)}`}>
                          {participant.metadata.role.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaTag className="w-4 h-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Episode Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Episode Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`status-badge ${getStatusColor(status)}`}>
                  {typeof metadata?.status === 'object' 
                    ? metadata.status.value 
                    : status
                  }
                </span>
              </div>
              
              {duration && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-900">{duration}</span>
                </div>
              )}
              
              {publishDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Published:</span>
                  <span className="text-gray-900">{formatDate(publishDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}