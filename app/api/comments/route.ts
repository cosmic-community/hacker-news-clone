import { NextRequest, NextResponse } from 'next/server'
import { createComment } from '@/lib/cosmic'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const { storyId, parentCommentId, content } = body

    // Validate input
    if (!storyId || !content) {
      return NextResponse.json(
        { error: 'Story ID and content are required' },
        { status: 400 }
      )
    }

    if (!content.trim()) {
      return NextResponse.json(
        { error: 'Comment cannot be empty' },
        { status: 400 }
      )
    }

    // Create comment
    const comment = await createComment(
      storyId,
      session.name,
      content.trim(),
      parentCommentId
    )

    return NextResponse.json(
      { 
        message: 'Comment posted successfully',
        comment: {
          id: comment.id,
          content: comment.metadata.content,
          author: comment.metadata.author
        }
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'You must be logged in to comment' },
        { status: 401 }
      )
    }
    console.error('Comment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 }
    )
  }
}