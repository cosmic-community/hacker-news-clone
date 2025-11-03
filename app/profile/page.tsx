import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUserById, getStoriesByAuthor } from '@/lib/cosmic'
import ProfileForm from '@/components/ProfileForm'
import StoryList from '@/components/StoryList'
import { Story } from '@/types'

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

  // Fetch user's submissions
  const submissions = await getStoriesByAuthor(user.metadata.name) as Story[]

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        <ProfileForm 
          initialName={user.metadata.name}
          initialEmail={user.metadata.email}
          createdAt={user.metadata.created_at}
          submissionCount={submissions.length}
        />
      </div>

      {/* User Submissions Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Your Submissions ({submissions.length})
        </h2>
        <StoryList stories={submissions} />
      </div>
    </div>
  )
}