import { NextRequest, NextResponse } from 'next/server'
import { createComment } from '@/lib/cosmic'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, storyId, parentCommentId } = body

    // Validate required fields
    if (!content || !storyId) {
      return NextResponse.json(
        { error: 'Content and storyId are required' },
        { status: 400 }
      )
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment cannot be empty' },
        { status: 400 }
      )
    }

    // Create the comment using the authenticated user's name
    const comment = await createComment(
      content.trim(),
      session.name,
      storyId,
      parentCommentId
    )

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}