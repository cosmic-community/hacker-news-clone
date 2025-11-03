import { cookies } from 'next/headers'
import { AuthSession } from '@/types'

const SESSION_COOKIE_NAME = 'auth_session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

// Simple password hashing (in production, use bcrypt)
export async function hashPassword(password: string): Promise<string> {
  // This is a simple implementation for demonstration
  // In production, use bcrypt or argon2
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

// Session management
export async function createSession(userId: string, email: string, name: string): Promise<void> {
  const session: AuthSession = {
    userId,
    email,
    name
  }
  
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/'
  })
}

export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    
    if (!sessionCookie || !sessionCookie.value) {
      return null
    }
    
    return JSON.parse(sessionCookie.value) as AuthSession
  } catch (error) {
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  return session
}