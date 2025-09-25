import { getQualityChecks } from '@/lib/cosmic'
import { formatDate, getStatusColor } from '@/lib/utils'
import { QualityCheck, getStatusValue, getStatusKey } from '@/types'
import { FaCheckCircle, FaExclamationCircle, FaClock, FaEye } from 'react-icons/fa'

export default async function QualityControlPage() {
  const qualityChecks = await getQualityChecks() as QualityCheck[]

  function getStatusIcon(status: string) {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="w-5 h-5 text-green-500" />
      case 'needs_work':
        return <FaExclamationCircle className="w-5 h-5 text-orange-500" />
      case 'rejected':
        return <FaExclamationCircle className="w-5 h-5 text-red-500" />
      default:
        return <FaClock className="w-5 h-5 text-gray-400" />
    }
  }

  if (qualityChecks.length === 0) {
    return (
      <div className="min-h-screen ml-64 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Quality Control</h1>
            <p className="text-gray-600 mt-2">Review and approve episode quality checks</p>
          </div>
          
          <div className="card p-8 text-center">
            <FaCheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Quality Checks</h3>
            <p className="text-gray-500">No quality reviews have been completed yet.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ml-64 bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quality Control</h1>
          <p className="text-gray-600 mt-2">Review and approve episode quality checks</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {qualityChecks.filter(check => getStatusKey(check.metadata?.approval_status, 'pending') === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-100">
                <FaExclamationCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Needs Work</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {qualityChecks.filter(check => getStatusKey(check.metadata?.approval_status, 'pending') === 'needs_work').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100">
                <FaClock className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {qualityChecks.filter(check => getStatusKey(check.metadata?.approval_status, 'pending') === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <FaEye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">{qualityChecks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Checks List */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Quality Reviews</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Episode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviewer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quality Checks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qualityChecks.map((check) => {
                  const statusValue = getStatusValue(check.metadata?.approval_status, 'pending')
                  const statusKey = getStatusKey(check.metadata?.approval_status, 'pending')
                  const episode = check.metadata?.episode
                  const reviewDate = check.metadata?.review_date
                  const reviewer = check.metadata?.reviewed_by
                  const audioChecks = check.metadata?.audio_quality_check || []
                  const contentChecks = check.metadata?.content_review || []

                  return (
                    <tr key={check.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {episode?.title || check.title}
                          </div>
                          {episode?.metadata?.episode_number && (
                            <div className="text-sm text-gray-500">
                              Episode #{episode.metadata.episode_number}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(statusKey)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(statusKey)}`}>
                            {statusValue}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reviewer?.title || 'Unassigned'}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reviewDate ? formatDate(reviewDate) : 'Not reviewed'}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600">
                            Audio: {audioChecks.length} checks
                          </div>
                          <div className="text-xs text-gray-600">
                            Content: {contentChecks.length} checks
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}