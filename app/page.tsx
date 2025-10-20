import DashboardStats from '@/components/DashboardStats'
import RecentEpisodes from '@/components/RecentEpisodes'
import RecentSessions from '@/components/RecentSessions'
import Link from 'next/link'
import { FaMicrophone, FaPlus } from 'react-icons/fa'

export const revalidate = 60

export default async function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Podcast Production Studio
        </h1>
        <p className="text-gray-600">
          Manage your podcast episodes, recordings, and production workflow all in one place.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/sessions"
          className="card p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-red-50 to-pink-50 border-red-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <FaMicrophone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Start Recording</h3>
              <p className="text-sm text-gray-600">Record your podcast directly in the app</p>
            </div>
          </div>
        </Link>

        <Link
          href="/episodes"
          className="card p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <FaPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">New Episode</h3>
              <p className="text-sm text-gray-600">Create and manage your episodes</p>
            </div>
          </div>
        </Link>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentEpisodes />
        <RecentSessions />
      </div>
    </div>
  )
}