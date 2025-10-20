import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const sessionId = formData.get('sessionId') as string
    const duration = formData.get('duration') as string
    const mimeType = formData.get('mimeType') as string
    
    if (!audioFile || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Convert File to buffer for Cosmic upload
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload audio file to Cosmic
    const mediaResponse = await cosmic.media.insertOne({
      media: buffer,
      folder: 'recordings',
      metadata: {
        originalName: audioFile.name,
        mimeType: mimeType || audioFile.type,
        sessionId: sessionId
      }
    })
    
    // Create audio clip record
    const clipResponse = await cosmic.objects.insertOne({
      title: `Recording - ${new Date().toLocaleString()}`,
      type: 'audio-clips',
      metadata: {
        session_id: sessionId,
        audio_file: mediaResponse.media.name,
        duration: parseInt(duration) || 0,
        clip_type: { key: 'content', value: 'Content' },
        is_included: true,
        notes: `Raw recording from session. File: ${audioFile.name}`,
        start_time: 0,
        end_time: parseInt(duration) || 0
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      clip: clipResponse.object,
      media: mediaResponse.media 
    })
  } catch (error) {
    console.error('Failed to upload recording:', error)
    return NextResponse.json(
      { error: 'Failed to upload recording', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}