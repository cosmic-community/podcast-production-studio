'use client'

import { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import NewSessionModal from './NewSessionModal'
import { getEpisodes, getParticipants } from '@/lib/cosmic'

export default function NewSessionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [episodes, setEpisodes] = useState([])
  const [participants, setParticipants] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenModal = async () => {
    setIsLoading(true)
    try {
      const [episodesData, participantsData] = await Promise.all([
        getEpisodes(),
        getParticipants()
      ])
      setEpisodes(episodesData)
      setParticipants(participantsData)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Failed to load data for session creation')
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
        {isLoading ? 'Loading...' : 'Schedule Session'}
      </button>

      <NewSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        episodes={episodes}
        participants={participants}
      />
    </>
  )
}