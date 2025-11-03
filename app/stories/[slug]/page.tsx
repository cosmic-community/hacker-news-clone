// app/stories/[slug]/page.tsx
import { getStory, getStoryComments } from '@/lib/cosmic'
import { Story, Comment } from '@/types'
import { notFound } from 'next/navigation'
import StoryDetail from '@/components/StoryDetail'
import CommentTree from '@/components/CommentTree'
import CommentForm from '@/components/CommentForm'
import { buildCommentTree } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import Link from 'next/link'

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
      
      {/* Comment form for logged-in users */}
      {session ? (
        <div className="bg-white border border-gray-300 rounded p-4">
          <h3 className="text-sm font-bold mb-3">Add a comment</h3>
          <CommentForm storyId={story.id} />
        </div>
      ) : (
        <div className="bg-white border border-gray-300 rounded p-4 text-center">
          <p className="text-hn-gray mb-3">
            Please log in to comment
          </p>
          <div className="flex gap-3 justify-center">
            <Link 
              href="/login" 
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm font-medium"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
      
      {/* Existing comments */}
      {commentTree.length > 0 && (
        <div className="bg-white border border-gray-300 rounded p-4">
          <h2 className="text-lg font-bold mb-4">
            {commentTree.length} comment{commentTree.length === 1 ? '' : 's'}
          </h2>
          <CommentTree comments={commentTree} />
        </div>
      )}
      
      {commentTree.length === 0 && !session && (
        <div className="bg-white border border-gray-300 rounded p-4 text-center text-hn-gray">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  )
}

export default StoryPage