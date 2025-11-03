// app/stories/[slug]/page.tsx
import { getStory, getStoryComments } from '@/lib/cosmic'
import { Story, Comment } from '@/types'
import { notFound } from 'next/navigation'
import StoryDetail from '@/components/StoryDetail'
import CommentSection from '@/components/CommentSection'
import { buildCommentTree } from '@/lib/utils'
import { getSession } from '@/lib/auth'

export const revalidate = 60

async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const story = await getStory(slug)
  
  if (!story) {
    notFound()
  }

  // Fetch comments using the story ID
  const comments = await getStoryComments(story.id)
  
  console.log('Comments fetched:', comments.length);
  if (comments.length > 0) {
    console.log('First comment parent_comment type:', typeof comments[0].metadata?.parent_comment);
    console.log('First comment parent_comment value:', comments[0].metadata?.parent_comment);
  }
  
  const commentTree = buildCommentTree(comments as Comment[])
  
  console.log('Comment tree built:', commentTree.length);
  console.log('Root comments:', commentTree.map(c => ({ id: c.id, author: c.metadata?.author })));

  // Check if user is logged in
  const session = await getSession()

  return (
    <div className="space-y-6">
      <StoryDetail story={story as Story} />
      
      <CommentSection 
        storyId={story.id}
        initialComments={commentTree}
        isLoggedIn={!!session}
      />
    </div>
  )
}

export default StoryPage