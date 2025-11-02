import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import CosmicBadge from '@/components/CosmicBadge'

export const metadata: Metadata = {
  title: 'Hacker News Clone',
  description: 'A modern Hacker News clone built with Next.js and Cosmic CMS',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
      </head>
      <body>
        <Header />
        <main className="max-w-5xl mx-auto px-2 py-4">
          {children}
        </main>
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}