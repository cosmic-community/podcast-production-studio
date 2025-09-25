import Link from 'next/link'
import { getEpisodes } from '@/lib/cosmic'
import { formatDate, getStatusColor, stripHtml, truncateText } from '@/lib/utils'
import { Episode, getStatusValue, getStatusKey } from '@/types'
import { FaArrowRight } from 'react-icons/fa'

export default async function RecentEpisodes() {
  const episodes = await getEpisodes()
  const recentEpisodes = episodes.slice(0, 3) as Episode[]

  if (recentEpisodes.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Episodes</h2>
        <p className="text-gray-500">No episodes found</p>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Episodes</h2>
        <Link href="/episodes" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {recentEpisodes.map((episode) => {
          const status = getStatusValue(episode.metadata?.status, 'draft')
          const statusKey = getStatusKey(episode.metadata?.status, 'draft')
          const description = stripHtml(episode.metadata?.description || '')
          const episodeNumber = episode.metadata?.episode_number
          const podcastSeries = episode.metadata?.podcast_series

          return (
            <div key={episode.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
              {episode.metadata?.cover_image?.imgix_url && (
                <img
                  src={`${episode.metadata.cover_image.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                  alt={episode.title}
                  width={40}
                  height={40}
                  className="rounded-lg flex-shrink-0"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {episodeNumber && (
                    <span className="text-xs font-medium text-gray-500">
                      #{episodeNumber}
                    </span>
                  )}
                  <span className={`status-badge ${getStatusColor(statusKey)}`}>
                    {status}
                  </span>
                </div>
                
                <Link 
                  href={`/episodes/${episode.slug}`}
                  className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {episode.title}
                </Link>
                
                {podcastSeries?.title && (
                  <p className="text-xs text-gray-500 mt-1">
                    {podcastSeries.title}
                  </p>
                )}
                
                {description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {truncateText(description, 120)}
                  </p>
                )}
                
                {episode.metadata?.publish_date && (
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(episode.metadata.publish_date)}
                  </p>
                )}
              </div>
              
              <FaArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            </div>
          )
        })}
      </div>
    </div>
  )
}