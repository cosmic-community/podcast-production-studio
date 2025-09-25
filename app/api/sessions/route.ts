import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await cosmic.objects.insertOne({
      title: body.title,
      type: body.type,
      metadata: body.metadata
    })
    
    return NextResponse.json(response.object)
  } catch (error) {
    console.error('Failed to create session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}