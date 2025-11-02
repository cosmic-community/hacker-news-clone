'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface StoryFilterProps {
  currentType?: string
}

export default function StoryFilter({ currentType }: StoryFilterProps) {
  const filters = [
    { label: 'All', value: undefined },
    { label: 'Link', value: 'link' },
    { label: 'Text', value: 'text' },
    { label: 'Ask HN', value: 'ask' },
    { label: 'Show HN', value: 'show' },
  ]

  return (
    <div className="mb-4 flex items-center gap-2 flex-wrap">
      <span className="text-sm font-bold text-hn-gray">Filter:</span>
      {filters.map(filter => (
        <Link
          key={filter.label}
          href={filter.value ? `/?type=${filter.value}` : '/'}
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            currentType === filter.value || (!currentType && !filter.value)
              ? 'bg-hn-orange text-white border-hn-orange'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  )
}