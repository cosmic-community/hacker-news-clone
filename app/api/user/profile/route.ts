import { NextRequest, NextResponse } from 'next/server'
import { getUserById, updateUser } from '@/lib/cosmic'
import { requireAuth, createSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const user = await getUserById(session.userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        user: {
          id: user.id,
          name: user.metadata.name,
          email: user.metadata.email,
          created_at: user.metadata.created_at
        }
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Profile error:', error)
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const { name, email } = body

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await updateUser(session.userId, name, email)

    // Update session with new data
    await createSession(updatedUser.id, updatedUser.metadata.email, updatedUser.metadata.name)

    return NextResponse.json(
      { 
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          name: updatedUser.metadata.name,
          email: updatedUser.metadata.email
        }
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}