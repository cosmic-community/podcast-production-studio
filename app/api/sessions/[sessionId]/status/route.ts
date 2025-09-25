import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const { type, timestamp, duration } = await request.json()
    
    let status = 'scheduled'
    let updates: any = {}
    
    switch (type) {
      case 'recording_started':
        status = 'live'
        updates.recording_started_at = timestamp
        break
      case 'recording_paused':
        updates.recording_paused_at = timestamp
        break
      case 'recording_resumed':
        updates.recording_resumed_at = timestamp
        break
      case 'recording_stopped':
      case 'recording_complete':
        status = 'completed'
        updates.recording_completed_at = timestamp
        if (duration) {
          updates.actual_duration = Math.round(duration / 60) // Convert to minutes
        }
        break
    }
    
    updates.status = { key: status, value: status.charAt(0).toUpperCase() + status.slice(1) }
    
    const response = await cosmic.objects.updateOne(sessionId, {
      metadata: updates
    })
    
    return NextResponse.json({ success: true, session: response.object })
  } catch (error) {
    console.error('Failed to update session status:', error)
    return NextResponse.json(
      { error: 'Failed to update session status' },
      { status: 500 }
    )
  }
}