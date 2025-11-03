// app/stories/[slug]/page.tsx
import { getStory, getStoryComments } from '@/lib/cosmic'
import { Story, Comment } from '@/types'
import { notFound } from 'next/navigation'
import StoryDetail from '@/components/StoryDetail'
import CommentTree from '@/components/CommentTree'
import { buildCommentTree } from '@/lib/utils'

export const revalidate = 60

async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const story = await getStory(slug)
  
  if (!story) {
    notFound()
  }

  // Fetch comments using the story ID
  const comments = await getStoryComments(story.id)
  
  console.log('Story:', story.title, 'ID:', story.id);
  console.log('Comments fetched:', comments.length);
  
  const commentTree = buildCommentTree(comments as Comment[])
  
  console.log('Comment tree built:', commentTree.length);

  return (
    <div className="space-y-6">
      <StoryDetail story={story as Story} />
      
      {commentTree.length > 0 && (
        <div className="bg-white border border-gray-300 rounded p-4">
          <h2 className="text-lg font-bold mb-4">
            {commentTree.length} comment{commentTree.length === 1 ? '' : 's'}
          </h2>
          <CommentTree comments={commentTree} />
        </div>
      )}
      
      {commentTree.length === 0 && (
        <div className="bg-white border border-gray-300 rounded p-4 text-center text-hn-gray">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  )
}

export default StoryPage