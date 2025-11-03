import { NextRequest, NextResponse } from 'next/server'
import { createStory } from '@/lib/cosmic'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth()
    
    const body = await request.json()
    const { title, storyType, url, content } = body

    // Validate input
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!storyType || !['link', 'text', 'ask', 'show'].includes(storyType)) {
      return NextResponse.json(
        { error: 'Valid story type is required' },
        { status: 400 }
      )
    }

    // Validate based on story type
    if (storyType === 'link' && (!url || !url.trim())) {
      return NextResponse.json(
        { error: 'URL is required for link posts' },
        { status: 400 }
      )
    }

    if ((storyType === 'text' || storyType === 'ask') && (!content || !content.trim())) {
      return NextResponse.json(
        { error: 'Content is required for text posts' },
        { status: 400 }
      )
    }

    // Create the story
    const story = await createStory(
      title.trim(),
      storyType,
      session.name,
      url?.trim(),
      content?.trim()
    )

    return NextResponse.json(
      { 
        message: 'Story created successfully',
        story: {
          id: story.id,
          slug: story.slug,
          title: story.title
        }
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Create story error:', error)
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    )
  }
}