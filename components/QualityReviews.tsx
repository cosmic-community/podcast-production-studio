import { getQualityChecks } from '@/lib/cosmic'
import { formatDate, getStatusColor } from '@/lib/utils'
import { QualityCheck, getStatusValue, getStatusKey } from '@/types'
import { FaCheckCircle, FaExclamationCircle, FaClock } from 'react-icons/fa'

export default async function QualityReviews() {
  const qualityChecks = await getQualityChecks()
  const recentChecks = qualityChecks.slice(0, 4) as QualityCheck[]

  if (recentChecks.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quality Reviews</h2>
        <p className="text-gray-500">No quality checks found</p>
      </div>
    )
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />
      case 'needs_work':
        return <FaExclamationCircle className="w-4 h-4 text-orange-500" />
      case 'rejected':
        return <FaExclamationCircle className="w-4 h-4 text-red-500" />
      default:
        return <FaClock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Quality Reviews</h2>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {recentChecks.map((check) => {
          const statusValue = getStatusValue(check.metadata?.approval_status, 'pending')
          const statusKey = getStatusKey(check.metadata?.approval_status, 'pending')
          const episode = check.metadata?.episode
          const reviewDate = check.metadata?.review_date
          const reviewer = check.metadata?.reviewed_by
          
          return (
            <div key={check.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0 pt-1">
                {getStatusIcon(statusKey)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {check.title}
                  </h3>
                  <span className={`status-badge ${getStatusColor(statusKey)}`}>
                    {statusValue}
                  </span>
                </div>
                
                {episode?.title && (
                  <p className="text-xs text-primary-600 mt-1">
                    Episode: {episode.title}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-2">
                  {reviewer?.title && (
                    <p className="text-xs text-gray-500">
                      Reviewed by {reviewer.title}
                    </p>
                  )}
                  
                  {reviewDate && (
                    <p className="text-xs text-gray-500">
                      {formatDate(reviewDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}