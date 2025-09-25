import { getParticipants } from '@/lib/cosmic'
import { getRoleColor } from '@/lib/utils'
import { Participant } from '@/types'
import { FaUsers, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa'

export default async function ParticipantList() {
  const participants = await getParticipants()

  if (participants.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaUsers className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No participants found</h3>
        <p className="text-gray-500 mb-4">Add hosts, guests, and team members to get started.</p>
        <button className="btn-primary">Add Participant</button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {participants.map((participant: Participant) => {
        const {
          name,
          email,
          bio,
          avatar,
          role,
          social_links,
          is_active
        } = participant.metadata

        return (
          <div key={participant.id} className="card p-6 hover:shadow-md transition-shadow">
            {/* Avatar and Basic Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {avatar?.imgix_url ? (
                  <img
                    src={`${avatar.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
                    alt={name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-15 h-15 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium text-gray-600">
                    {(name || participant.title).charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{name || participant.title}</h3>
                  {role?.value && (
                    <span className={`status-badge ${getRoleColor(role.key || role.value)}`}>
                      {role.value}
                    </span>
                  )}
                </div>
              </div>
              
              {is_active ? (
                <div className="w-3 h-3 bg-green-500 rounded-full" title="Active" />
              ) : (
                <div className="w-3 h-3 bg-gray-300 rounded-full" title="Inactive" />
              )}
            </div>

            {/* Bio */}
            {bio && (
              <div className="mb-4">
                <div 
                  className="text-sm text-gray-600 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: bio }}
                />
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaEnvelope className="w-4 h-4" />
                <span className="truncate">{email}</span>
              </div>
              
              {/* Social Links */}
              {social_links && Object.keys(social_links).length > 0 && (
                <div className="flex items-center gap-3 pt-2">
                  {Object.entries(social_links).map(([platform, url]) => {
                    if (!url) return null
                    
                    return (
                      <a
                        key={platform}
                        href={url.toString().startsWith('http') ? url.toString() : `https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm capitalize flex items-center gap-1"
                        title={`${platform}: ${url}`}
                      >
                        <FaExternalLinkAlt className="w-3 h-3" />
                        {platform}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <button className="btn-secondary text-xs flex-1">Edit</button>
              <button className="btn-primary text-xs flex-1">Schedule</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}