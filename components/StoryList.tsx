import { Story } from '@/types'
import StoryItem from '@/components/StoryItem'

interface StoryListProps {
  stories: Story[]
}

export default function StoryList({ stories }: StoryListProps) {
  if (!stories || stories.length === 0) {
    return (
      <div className="bg-white border border-gray-300 rounded p-8 text-center text-hn-gray">
        No stories found
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-300 rounded">
      {stories.map((story, index) => (
        <StoryItem 
          key={story.id} 
          story={story} 
          rank={index + 1}
        />
      ))}
    </div>
  )
}