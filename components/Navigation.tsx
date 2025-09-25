'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FaHome, 
  FaMicrophone, 
  FaUsers, 
  FaVideo, 
  FaClipboard, 
  FaDollarSign,
  FaCog
} from 'react-icons/fa'

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: FaHome },
  { name: 'Episodes', href: '/episodes', icon: FaMicrophone },
  { name: 'Participants', href: '/participants', icon: FaUsers },
  { name: 'Recording Sessions', href: '/sessions', icon: FaVideo },
  { name: 'Quality Control', href: '/quality', icon: FaClipboard },
  { name: 'Sponsors', href: '/sponsors', icon: FaDollarSign },
  { name: 'Settings', href: '/settings', icon: FaCog },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:block hidden">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <FaMicrophone className="w-8 h-8 text-primary-600" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">Podcast Studio</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <FaUsers className="w-4 h-4 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Production Team</p>
              <p className="text-xs text-gray-500">Admin Access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}