import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-white border border-gray-300 rounded p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">404 - Not Found</h2>
      <p className="text-hn-gray mb-4">
        The page you're looking for doesn't exist.
      </p>
      <Link href="/" className="hn-button inline-block">
        Return Home
      </Link>
    </div>
  )
}