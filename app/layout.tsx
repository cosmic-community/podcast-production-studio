import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Podcast Production Studio',
  description: 'Professional podcast recording, editing, and publishing platform',
  keywords: ['podcast', 'recording', 'editing', 'publishing', 'audio', 'collaboration'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script src="/dashboard-console-capture.js" />
        {/* Console capture script for dashboard debugging */}
      </head>
      <body className="min-h-screen bg-gray-50">
        <div className="min-h-screen">
          <Navigation />
          
          {/* Main content with proper spacing for sidebar */}
          <main className="lg:pl-64">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>
        
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}