import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-hn-orange border-b-2 border-hn-orange-dark">
      <div className="max-w-5xl mx-auto px-2 py-2">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:no-underline">
            <div className="w-5 h-5 bg-white border border-white" />
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
          </nav>
        </div>
      </div>
    </header>
  )
}