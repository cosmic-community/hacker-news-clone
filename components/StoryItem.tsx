import Link from 'next/link'
import { Story } from '@/types'
import { timeAgo, getDomain } from '@/lib/utils'

interface StoryItemProps {
  story: Story
  rank: number
}

export default function StoryItem({ story, rank }: StoryItemProps) {
  const isExternalLink = story.metadata?.url
  const domain = isExternalLink ? getDomain(story.metadata.url || '') : ''

  return (
    <div className="flex gap-2 px-3 py-2 border-b last:border-b-0 hover:bg-gray-50">
      <div className="text-hn-gray text-sm pt-1 w-8 text-right flex-shrink-0">
        {rank}.
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            {isExternalLink ? (
              <a 
                href={story.metadata.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hn-link font-normal"
              >
                {story.metadata?.title || story.title}
              </a>
            ) : (
              <Link href={`/stories/${story.slug}`} className="hn-link font-normal">
                {story.metadata?.title || story.title}
              </Link>
            )}
            
            {domain && (
              <span className="text-xs text-hn-gray ml-2">
                ({domain})
              </span>
            )}
          </div>
        </div>
        
        <div className="hn-subtext mt-1 flex items-center gap-2 flex-wrap">
          <span>{story.metadata?.points || 0} points</span>
          <span>•</span>
          <span>by {story.metadata?.author || 'unknown'}</span>
          <span>•</span>
          <span>{timeAgo(story.created_at)}</span>
          <span>•</span>
          <Link 
            href={`/stories/${story.slug}`}
            className="hover:underline"
          >
            {story.metadata?.comment_count || 0} comments
          </Link>
        </div>
      </div>
    </div>
  )
}