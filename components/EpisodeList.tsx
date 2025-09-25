import Link from 'next/link'
import { getEpisodes } from '@/lib/cosmic'
import { formatDate, getStatusColor, stripHtml, truncateText } from '@/lib/utils'
import { Episode, getStatusValue, getStatusKey } from '@/types'
import { FaPlay, FaClock, FaUsers } from 'react-icons/fa'

export default async function EpisodeList() {
  const episodes = await getEpisodes()

  if (episodes.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaPlay className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No episodes found</h3>
        <p className="text-gray-500 mb-4">Get started by creating your first podcast episode.</p>
        <button className="btn-primary">Create Episode</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {episodes.map((episode: Episode) => {
        const status = getStatusValue(episode.metadata?.status, 'draft')
        const statusKey = getStatusKey(episode.metadata?.status, 'draft')
        const description = stripHtml(episode.metadata?.description || '')
        const episodeNumber = episode.metadata?.episode_number
        const podcastSeries = episode.metadata?.podcast_series
        const participants = episode.metadata?.participants || []
        const duration = episode.metadata?.duration
        const publishDate = episode.metadata?.publish_date

        return (
          <div key={episode.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-6">
              {/* Episode Cover */}
              <div className="flex-shrink-0">
                {episode.metadata?.cover_image?.imgix_url ? (
                  <img
                    src={`${episode.metadata.cover_image.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                    alt={episode.title}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FaPlay className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Episode Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  {episodeNumber && (
                    <span className="text-sm font-medium text-gray-500">
                      Episode #{episodeNumber}
                    </span>
                  )}
                  <span className={`status-badge ${getStatusColor(statusKey)}`}>
                    {status}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link 
                    href={`/episodes/${episode.slug}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {episode.title}
                  </Link>
                </h2>

                {podcastSeries?.title && (
                  <p className="text-sm text-primary-600 mb-3">
                    {podcastSeries.title}
                  </p>
                )}

                {description && (
                  <p className="text-gray-600 mb-4">
                    {truncateText(description, 200)}
                  </p>
                )}

                {/* Episode Meta */}
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  {duration && (
                    <div className="flex items-center gap-1">
                      <FaClock className="w-4 h-4" />
                      {duration}
                    </div>
                  )}
                  
                  {participants.length > 0 && (
                    <div className="flex items-center gap-1">
                      <FaUsers className="w-4 h-4" />
                      {participants.length} participant{participants.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  
                  {publishDate && (
                    <span>Published {formatDate(publishDate)}</span>
                  )}
                </div>

                {/* Participants */}
                {participants.length > 0 && (
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-sm font-medium text-gray-700">Participants:</span>
                    <div className="flex items-center gap-2">
                      {participants.slice(0, 4).map((participant: any, index: number) => (
                        <div
                          key={participant.id || index}
                          className="flex items-center gap-1"
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
                          <span className="text-sm text-gray-600">
                            {participant.title}
                          </span>
                        </div>
                      ))}
                      {participants.length > 4 && (
                        <span className="text-sm text-gray-500">
                          +{participants.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}