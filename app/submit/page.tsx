import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import SubmitForm from '@/components/SubmitForm'

export default async function SubmitPage() {
  const session = await getSession()
  
  // Require authentication
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit a New Post</h1>
        <SubmitForm />
      </div>
    </div>
  )
}