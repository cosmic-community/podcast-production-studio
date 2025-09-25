import { getEpisodes, getParticipants, getRecordingSessions, getQualityChecks } from '@/lib/cosmic'
import { FaMicrophone, FaUsers, FaVideo, FaClipboard } from 'react-icons/fa'

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<any>;
  color: string;
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && (
              <p className="ml-2 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function DashboardStats() {
  const [episodes, participants, sessions, qualityChecks] = await Promise.all([
    getEpisodes(),
    getParticipants(),
    getRecordingSessions(),
    getQualityChecks()
  ])

  const publishedEpisodes = episodes.filter((episode: any) => 
    episode.metadata?.status?.key === 'published'
  )
  
  const activeParticipants = participants.filter((participant: any) => 
    participant.metadata?.is_active === true
  )
  
  const completedSessions = sessions.filter((session: any) => 
    session.metadata?.status?.key === 'completed'
  )
  
  const approvedChecks = qualityChecks.filter((check: any) => 
    check.metadata?.approval_status?.key === 'approved'
  )

  const stats = [
    {
      title: 'Total Episodes',
      value: episodes.length,
      subtitle: `${publishedEpisodes.length} published`,
      icon: FaMicrophone,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Participants',
      value: activeParticipants.length,
      subtitle: 'hosts & guests',
      icon: FaUsers,
      color: 'bg-green-500'
    },
    {
      title: 'Recording Sessions',
      value: sessions.length,
      subtitle: `${completedSessions.length} completed`,
      icon: FaVideo,
      color: 'bg-purple-500'
    },
    {
      title: 'Quality Reviews',
      value: qualityChecks.length,
      subtitle: `${approvedChecks.length} approved`,
      icon: FaClipboard,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  )
}