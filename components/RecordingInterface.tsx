'use client'

import { useState, useEffect, useRef } from 'react'
import { FaMicrophone, FaStop, FaPause, FaPlay, FaUsers, FaCog, FaWaveSquare } from 'react-icons/fa'

interface RecordingInterfaceProps {
  sessionId: string
  participants: any[]
  onRecordingUpdate: (data: any) => void
}

interface AudioLevel {
  participantId: string
  level: number
}

export default function RecordingInterface({ sessionId, participants, onRecordingUpdate }: RecordingInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevels, setAudioLevels] = useState<AudioLevel[]>([])
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const recordingChunks = useRef<Blob[]>([])

  // Initialize audio recording
  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000
        } 
      })
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunks.current.push(event.data)
        }
      }
      
      recorder.onstop = () => {
        const blob = new Blob(recordingChunks.current, { type: 'audio/webm' })
        onRecordingUpdate({
          type: 'recording_complete',
          audioBlob: blob,
          duration: recordingTime,
          sessionId
        })
        recordingChunks.current = []
      }
      
      setMediaRecorder(recorder)
      setAudioStream(stream)
      
      // Set up audio level monitoring
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      analyser.fftSize = 256
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      
      const updateAudioLevels = () => {
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
        const normalizedLevel = Math.min(100, (average / 255) * 100)
        
        setAudioLevels([{
          participantId: 'local',
          level: normalizedLevel
        }])
        
        if (isRecording && !isPaused) {
          requestAnimationFrame(updateAudioLevels)
        }
      }
      
      updateAudioLevels()
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  // Start recording
  const startRecording = async () => {
    if (!mediaRecorder) {
      await initializeAudio()
      return
    }
    
    if (mediaRecorder.state === 'inactive') {
      mediaRecorder.start(1000) // Record in 1-second chunks
      setIsRecording(true)
      setIsPaused(false)
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      onRecordingUpdate({
        type: 'recording_started',
        sessionId,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause()
      setIsPaused(true)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      
      onRecordingUpdate({
        type: 'recording_paused',
        sessionId,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume()
      setIsPaused(false)
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      onRecordingUpdate({
        type: 'recording_resumed',
        sessionId,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      
      onRecordingUpdate({
        type: 'recording_stopped',
        sessionId,
        timestamp: new Date().toISOString(),
        duration: recordingTime
      })
    }
  }

  // Format recording time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [audioStream])

  useEffect(() => {
    initializeAudio()
  }, [])

  return (
    <div className="card p-6 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
      {/* Recording Status Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${isRecording && !isPaused ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isRecording && !isPaused ? 'Recording Live' : isPaused ? 'Recording Paused' : 'Ready to Record'}
          </h2>
        </div>
        
        <div className="text-2xl font-mono font-bold text-gray-900">
          {formatTime(recordingTime)}
        </div>
      </div>

      {/* Audio Level Meters */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FaWaveSquare className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Audio Levels</span>
        </div>
        
        <div className="space-y-3">
          {audioLevels.map((level, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-16 text-sm font-medium text-gray-600">
                Local
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-red-500 transition-all duration-150 ease-out rounded-full"
                  style={{ 
                    width: `${Math.max(1, level.level)}%`,
                    backgroundColor: level.level > 80 ? '#ef4444' : level.level > 50 ? '#f59e0b' : '#10b981'
                  }}
                ></div>
              </div>
              <div className="w-12 text-sm font-mono text-gray-600">
                {Math.round(level.level)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Participants Status */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FaUsers className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Session Participants ({participants.length})
          </span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {participants.map((participant, index) => (
            <div key={participant.id || index} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border">
              {participant.metadata?.avatar?.imgix_url ? (
                <img
                  src={`${participant.metadata.avatar.imgix_url}?w=48&h=48&fit=crop&auto=format,compress`}
                  alt={participant.title}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                  {(participant.title || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-gray-900">
                {participant.title}
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Online"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRecording && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <FaMicrophone className="w-5 h-5" />
            Start Recording
          </button>
        )}
        
        {isRecording && !isPaused && (
          <>
            <button
              onClick={pauseRecording}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <FaPause className="w-5 h-5" />
              Pause
            </button>
            
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <FaStop className="w-5 h-5" />
              Stop Recording
            </button>
          </>
        )}
        
        {isRecording && isPaused && (
          <>
            <button
              onClick={resumeRecording}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <FaPlay className="w-5 h-5" />
              Resume
            </button>
            
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <FaStop className="w-5 h-5" />
              Stop Recording
            </button>
          </>
        )}
        
        <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
          <FaCog className="w-5 h-5" />
          Settings
        </button>
      </div>

      {/* Recording Tips */}
      {!isRecording && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Recording Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure all participants have good audio quality</li>
            <li>• Keep audio levels in the green zone</li>
            <li>• Have backup recording equipment ready</li>
            <li>• Test audio before starting the session</li>
          </ul>
        </div>
      )}
    </div>
  )
}