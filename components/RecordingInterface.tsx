'use client'

import { useState, useEffect, useRef } from 'react'
import { FaMicrophone, FaStop, FaPause, FaPlay, FaUsers, FaCog, FaWaveSquare, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

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
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const recordingChunks = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Check if browser supports recording
  const checkBrowserSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionError('Your browser does not support audio recording. Please use a modern browser like Chrome, Firefox, or Safari.')
      return false
    }
    
    if (!window.MediaRecorder) {
      setPermissionError('MediaRecorder is not supported in your browser.')
      return false
    }
    
    return true
  }

  // Initialize audio recording
  const initializeAudio = async () => {
    if (!checkBrowserSupport()) {
      return
    }

    setIsInitializing(true)
    setPermissionError(null)

    try {
      // Request microphone access with high-quality settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1
        } 
      })
      
      setPermissionGranted(true)
      
      // Check supported MIME types
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4'
      ]
      
      const supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type))
      
      if (!supportedMimeType) {
        throw new Error('No supported audio format found')
      }
      
      const recorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType,
        audioBitsPerSecond: 128000
      })
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunks.current.push(event.data)
        }
      }
      
      recorder.onstop = async () => {
        setIsSaving(true)
        const blob = new Blob(recordingChunks.current, { type: supportedMimeType })
        
        try {
          await onRecordingUpdate({
            type: 'recording_complete',
            audioBlob: blob,
            duration: recordingTime,
            sessionId,
            mimeType: supportedMimeType
          })
        } catch (error) {
          console.error('Failed to save recording:', error)
          alert('Failed to save recording. Please try again.')
        } finally {
          setIsSaving(false)
          recordingChunks.current = []
        }
      }
      
      recorder.onerror = (event: Event) => {
        console.error('MediaRecorder error:', event)
        setPermissionError('An error occurred during recording. Please try again.')
      }
      
      setMediaRecorder(recorder)
      setAudioStream(stream)
      
      // Set up audio level monitoring
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      
      // Start audio level monitoring
      updateAudioLevels()
      
    } catch (error: any) {
      console.error('Error accessing microphone:', error)
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setPermissionError('Microphone access was denied. Please allow microphone access in your browser settings and refresh the page.')
      } else if (error.name === 'NotFoundError') {
        setPermissionError('No microphone found. Please connect a microphone and try again.')
      } else if (error.name === 'NotReadableError') {
        setPermissionError('Your microphone is already in use by another application. Please close other apps and try again.')
      } else {
        setPermissionError(`Unable to access microphone: ${error.message}`)
      }
    } finally {
      setIsInitializing(false)
    }
  }

  // Update audio levels visualization
  const updateAudioLevels = () => {
    if (!analyserRef.current) return
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    
    const animate = () => {
      if (!analyserRef.current || (!isRecording && !permissionGranted)) return
      
      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
      const normalizedLevel = Math.min(100, (average / 255) * 100)
      
      setAudioLevels([{
        participantId: 'local',
        level: normalizedLevel
      }])
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
  }

  // Start recording
  const startRecording = async () => {
    if (!mediaRecorder) {
      await initializeAudio()
      return
    }
    
    if (mediaRecorder.state === 'inactive') {
      try {
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
      } catch (error) {
        console.error('Failed to start recording:', error)
        setPermissionError('Failed to start recording. Please try again.')
      }
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [audioStream])

  // Initialize on mount
  useEffect(() => {
    initializeAudio()
  }, [])

  return (
    <div className="space-y-6">
      {/* Permission/Error State */}
      {permissionError && (
        <div className="card p-6 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">Microphone Access Required</h3>
              <p className="text-red-800 text-sm mb-4">{permissionError}</p>
              <button
                onClick={initializeAudio}
                disabled={isInitializing}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                {isInitializing ? 'Requesting Access...' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Granted State */}
      {permissionGranted && !permissionError && (
        <div className="card p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 text-green-800">
            <FaCheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Microphone ready</span>
          </div>
        </div>
      )}

      {/* Recording Interface */}
      <div className="card p-6 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        {/* Recording Status Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${
              isRecording && !isPaused ? 'bg-red-500 animate-pulse' : 
              isPaused ? 'bg-yellow-500' :
              'bg-gray-300'
            }`}></div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isSaving ? 'Saving Recording...' :
               isRecording && !isPaused ? 'Recording Live' : 
               isPaused ? 'Recording Paused' : 
               'Ready to Record'}
            </h2>
          </div>
          
          <div className="text-2xl font-mono font-bold text-gray-900">
            {formatTime(recordingTime)}
          </div>
        </div>

        {/* Audio Level Meters */}
        {permissionGranted && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FaWaveSquare className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Audio Input Level</span>
            </div>
            
            <div className="space-y-3">
              {audioLevels.map((level, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-16 text-sm font-medium text-gray-600">
                    Input
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full transition-all duration-150 ease-out rounded-full"
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
            
            {audioLevels[0]?.level < 5 && !isRecording && (
              <p className="text-sm text-yellow-700 mt-2 flex items-center gap-2">
                <FaExclamationTriangle className="w-4 h-4" />
                Low audio detected. Please speak or check your microphone.
              </p>
            )}
          </div>
        )}

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
                <div className="w-2 h-2 bg-green-500 rounded-full" title="Ready"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {!isRecording && (
            <button
              onClick={startRecording}
              disabled={!permissionGranted || isInitializing || isSaving}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <FaMicrophone className="w-5 h-5" />
              {isInitializing ? 'Initializing...' : 'Start Recording'}
            </button>
          )}
          
          {isRecording && !isPaused && (
            <>
              <button
                onClick={pauseRecording}
                disabled={isSaving}
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <FaPause className="w-5 h-5" />
                Pause
              </button>
              
              <button
                onClick={stopRecording}
                disabled={isSaving}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <FaPlay className="w-5 h-5" />
                Resume
              </button>
              
              <button
                onClick={stopRecording}
                disabled={isSaving}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <FaStop className="w-5 h-5" />
                Stop Recording
              </button>
            </>
          )}
        </div>

        {/* Recording Tips */}
        {!isRecording && !isSaving && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Recording Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Position microphone 6-12 inches from your mouth</li>
              <li>• Keep audio levels in the green zone (avoid red)</li>
              <li>• Record in a quiet environment to minimize background noise</li>
              <li>• Test audio before starting the full recording</li>
              <li>• Use headphones to prevent audio feedback</li>
              <li>• Speak clearly and maintain consistent volume</li>
            </ul>
          </div>
        )}

        {/* Saving State */}
        {isSaving && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-yellow-900 font-medium">
                Saving your recording to Cosmic CMS...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}