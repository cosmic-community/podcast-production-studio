// app/episodes/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getEpisode } from '@/lib/cosmic'
import EpisodeDetails from '@/components/EpisodeDetails'
import { Episode } from '@/types'

interface EpisodePageProps {
  params: Promise<{ slug: string }>
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = await params
  
  const episode = await getEpisode(slug) as Episode

  if (!episode) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <EpisodeDetails episode={episode} />
    </div>
  )
}