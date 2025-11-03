// app/stories/[slug]/page.tsx
import { getStory, getStoryComments } from '@/lib/cosmic'
import { getSession } from '@/lib/auth'
import { Story, Comment } from '@/types'
import { notFound } from 'next/navigation'
import StoryDetail from '@/components/StoryDetail'
import CommentTree from '@/components/CommentTree'
import CommentForm from '@/components/CommentForm'
import { buildCommentTree } from '@/lib/utils'

export const revalidate = 60

async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const story = await getStory(slug)
  
  if (!story) {
    notFound()
  }

  // Check if user is logged in
  const session = await getSession()
  const isLoggedIn = !!session

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

  return (
    <div className="space-y-6">
      <StoryDetail story={story as Story} />
      
      {/* Comment form for logged in users */}
      {isLoggedIn && (
        <div className="bg-white border border-gray-300 rounded p-4">
          <h3 className="text-sm font-bold mb-3">Add a comment</h3>
          <CommentForm storyId={story.id} />
        </div>
      )}
      
      {/* Login prompt for anonymous users */}
      {!isLoggedIn && (
        <div className="bg-gray-50 border border-gray-300 rounded p-4 text-center">
          <p className="text-sm text-hn-gray mb-2">
            <a href="/login" className="hn-link">Log in</a> or <a href="/signup" className="hn-link">sign up</a> to leave a comment
          </p>
        </div>
      )}
      
      {commentTree.length > 0 && (
        <div className="bg-white border border-gray-300 rounded p-4">
          <h2 className="text-lg font-bold mb-4">
            {commentTree.length} comment{commentTree.length === 1 ? '' : 's'}
          </h2>
          <CommentTree 
            comments={commentTree} 
            storyId={story.id}
            isLoggedIn={isLoggedIn}
          />
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