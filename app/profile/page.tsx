import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUserById } from '@/lib/cosmic'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const session = await getSession()
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login')
  }

  const user = await getUserById(session.userId)

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        <ProfileForm 
          initialName={user.metadata.name}
          initialEmail={user.metadata.email}
          createdAt={user.metadata.created_at}
        />
      </div>
    </div>
  )
}