import { getSponsorSegments } from '@/lib/cosmic'
import { formatDate } from '@/lib/utils'
import { SponsorSegment, getStatusValue, getStatusKey } from '@/types'
import { FaDollarSign, FaPlayCircle, FaPause, FaCalendarAlt } from 'react-icons/fa'

export default async function SponsorsPage() {
  const sponsorSegments = await getSponsorSegments() as SponsorSegment[]

  function getPlacementIcon(placement: string) {
    switch (placement) {
      case 'pre_roll':
        return <FaPlayCircle className="w-4 h-4 text-blue-500" />
      case 'mid_roll':
        return <FaPause className="w-4 h-4 text-orange-500" />
      case 'post_roll':
        return <FaPlayCircle className="w-4 h-4 text-green-500" />
      default:
        return <FaDollarSign className="w-4 h-4 text-gray-400" />
    }
  }

  function getPlacementLabel(placement: string) {
    switch (placement) {
      case 'pre_roll':
        return 'Pre-roll'
      case 'mid_roll':
        return 'Mid-roll'
      case 'post_roll':
        return 'Post-roll'
      default:
        return 'Not set'
    }
  }

  const activeSponsors = sponsorSegments.filter(sponsor => sponsor.metadata?.is_active)
  const inactiveSponsors = sponsorSegments.filter(sponsor => !sponsor.metadata?.is_active)

  if (sponsorSegments.length === 0) {
    return (
      <div className="min-h-screen ml-64 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sponsors</h1>
            <p className="text-gray-600 mt-2">Manage sponsor segments and advertising campaigns</p>
          </div>
          
          <div className="card p-8 text-center">
            <FaDollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Sponsors</h3>
            <p className="text-gray-500">No sponsor segments have been created yet.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ml-64 bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sponsors</h1>
          <p className="text-gray-600 mt-2">Manage sponsor segments and advertising campaigns</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <FaDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-semibold text-gray-900">{activeSponsors.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <FaPlayCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pre-roll Ads</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sponsorSegments.filter(s => getStatusKey(s.metadata?.placement, '') === 'pre_roll').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-100">
                <FaPause className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mid-roll Ads</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sponsorSegments.filter(s => getStatusKey(s.metadata?.placement, '') === 'mid_roll').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <FaCalendarAlt className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sponsors</p>
                <p className="text-2xl font-semibold text-gray-900">{sponsorSegments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Sponsors */}
        {activeSponsors.length > 0 && (
          <div className="card mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Active Campaigns</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sponsor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Placement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target Episodes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeSponsors.map((sponsor) => {
                    const placementKey = getStatusKey(sponsor.metadata?.placement, '')
                    const placementValue = getStatusValue(sponsor.metadata?.placement, 'Not set')
                    const targetEpisodes = sponsor.metadata?.target_episodes || []

                    return (
                      <tr key={sponsor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {sponsor.metadata?.sponsor_name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {sponsor.metadata?.ad_copy?.substring(0, 60)}...
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getPlacementIcon(placementKey)}
                            <span className="ml-2 text-sm text-gray-900">
                              {getPlacementLabel(placementKey)}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>{formatDate(sponsor.metadata?.campaign_start_date)}</div>
                            <div className="text-xs">to {formatDate(sponsor.metadata?.campaign_end_date)}</div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {targetEpisodes.length > 0 ? `${targetEpisodes.length} episodes` : 'All episodes'}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inactive Sponsors */}
        {inactiveSponsors.length > 0 && (
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Inactive Campaigns</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sponsor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Placement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inactiveSponsors.map((sponsor) => {
                    const placementKey = getStatusKey(sponsor.metadata?.placement, '')

                    return (
                      <tr key={sponsor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {sponsor.metadata?.sponsor_name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {sponsor.metadata?.ad_copy?.substring(0, 60)}...
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getPlacementIcon(placementKey)}
                            <span className="ml-2 text-sm text-gray-900">
                              {getPlacementLabel(placementKey)}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>{formatDate(sponsor.metadata?.campaign_start_date)}</div>
                            <div className="text-xs">to {formatDate(sponsor.metadata?.campaign_end_date)}</div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}