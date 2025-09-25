'use client'

import { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import NewEpisodeModal from './NewEpisodeModal'
import { getPodcastSeries, getParticipants } from '@/lib/cosmic'

export default function NewEpisodeButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [podcastSeries, setPodcastSeries] = useState([])
  const [participants, setParticipants] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenModal = async () => {
    setIsLoading(true)
    try {
      const [seriesData, participantsData] = await Promise.all([
        getPodcastSeries(),
        getParticipants()
      ])
      setPodcastSeries(seriesData)
      setParticipants(participantsData)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Failed to load data for episode creation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        className="btn-primary flex items-center gap-2"
        onClick={handleOpenModal}
        disabled={isLoading}
      >
        <FaPlus className="w-4 h-4" />
        {isLoading ? 'Loading...' : 'New Episode'}
      </button>

      <NewEpisodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        podcastSeries={podcastSeries}
        participants={participants}
      />
    </>
  )
}