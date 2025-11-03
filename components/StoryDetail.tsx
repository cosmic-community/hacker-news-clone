import { Story } from '@/types'
import { timeAgo, getDomain } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface StoryDetailProps {
  story: Story
}

export default function StoryDetail({ story }: StoryDetailProps) {
  const isExternalLink = story.metadata?.url
  const domain = isExternalLink ? getDomain(story.metadata.url || '') : ''
  const hasContent = story.metadata?.content

  return (
    <div className="bg-white border border-gray-300 rounded p-4">
      <div className="space-y-3">
        <div>
          <h1 className="text-xl font-normal mb-2">
            {isExternalLink ? (
              <a 
                href={story.metadata.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hn-link"
              >
                {story.metadata?.title || story.title}
              </a>
            ) : (
              <span>{story.metadata?.title || story.title}</span>
            )}
            
            {domain && (
              <span className="text-sm text-hn-gray ml-2">
                ({domain})
              </span>
            )}
          </h1>
          
          <div className="hn-subtext flex items-center gap-2 flex-wrap">
            <span>{story.metadata?.points || 0} points</span>
            <span>•</span>
            <span>by {story.metadata?.author || 'unknown'}</span>
            <span>•</span>
            <span>{timeAgo(story.created_at)}</span>
          </div>
        </div>

        {hasContent && (
          <div className="prose prose-sm max-w-none pt-3 border-t">
            <ReactMarkdown>{story.metadata.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}