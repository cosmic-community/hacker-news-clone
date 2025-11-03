import Link from 'next/link'
import { getSession } from '@/lib/auth'

export default async function Header() {
  const session = await getSession()

  return (
    <header className="bg-hn-orange border-b-2 border-hn-orange-dark">
      <div className="max-w-5xl mx-auto px-2 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:no-underline">
              <div className="w-5 h-5 bg-white border border-white flex items-center justify-center">
                <span className="text-hn-orange font-bold text-xs leading-none" style={{ fontFamily: 'monospace' }}>Y</span>
              </div>
              <span className="text-white font-bold text-sm">Hacker News</span>
            </Link>
            
            <nav className="flex items-center gap-3 text-sm">
              <Link href="/" className="text-white hover:underline">
                new
              </Link>
              <span className="text-white">|</span>
              <Link href="/?type=ask" className="text-white hover:underline">
                ask
              </Link>
              <span className="text-white">|</span>
              <Link href="/?type=show" className="text-white hover:underline">
                show
              </Link>
              {session && (
                <>
                  <span className="text-white">|</span>
                  <Link href="/submit" className="text-white hover:underline">
                    submit
                  </Link>
                </>
              )}
            </nav>
          </div>

          <nav className="flex items-center gap-3 text-sm">
            {session ? (
              <>
                <Link href="/profile" className="text-white hover:underline">
                  {session.name}
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white hover:underline">
                  login
                </Link>
                <span className="text-white">|</span>
                <Link href="/signup" className="text-white hover:underline">
                  signup
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}