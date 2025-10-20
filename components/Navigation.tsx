'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaMicrophone, FaFileAudio, FaUsers, FaCheckCircle, FaDollarSign, FaCog } from 'react-icons/fa'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Dashboard', icon: FaHome },
    { href: '/sessions', label: 'Record', icon: FaMicrophone },
    { href: '/episodes', label: 'Episodes', icon: FaFileAudio },
    { href: '/participants', label: 'Participants', icon: FaUsers },
    { href: '/quality', label: 'Quality', icon: FaCheckCircle },
    { href: '/sponsors', label: 'Sponsors', icon: FaDollarSign },
    { href: '/settings', label: 'Settings', icon: FaCog },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4 mb-5">
              <h1 className="text-xl font-bold text-gray-900">🎙️ Podcast Studio</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">🎙️ Podcast Studio</h1>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="bg-white border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-4 px-4 py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}