import { getStories } from '@/lib/cosmic'
import { Story } from '@/types'
import StoryList from '@/components/StoryList'
import StoryFilter from '@/components/StoryFilter'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const stories = await getStories()
  
  // Filter by type if specified
  let filteredStories = stories as Story[]
  if (params.type) {
    filteredStories = stories.filter((story: any) => 
      story.metadata?.story_type?.key === params.type
    ) as Story[]
  }
  
  // Sort by points (highest first)
  const sortedStories = filteredStories.sort((a, b) => 
    (b.metadata?.points || 0) - (a.metadata?.points || 0)
  )

  return (
    <div>
      <StoryFilter currentType={params.type} />
      <StoryList stories={sortedStories} />
    </div>
  )
}