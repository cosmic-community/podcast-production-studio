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
        <div className="flex min-h-screen">
          <Navigation />
          
          <main className="flex-1 lg:pl-64">
            <div className="py-8">
              {children}
            </div>
          </main>
        </div>
        
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}