import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import SignupForm from '@/components/SignupForm'

export default async function SignupPage() {
  const session = await getSession()
  
  // Redirect to home if already logged in
  if (session) {
    redirect('/')
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h1>
        <SignupForm />
      </div>
    </div>
  )
}