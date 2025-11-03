'use client'

import { useState } from 'react'
import { NestedComment } from '@/types'
import CommentForm from '@/components/CommentForm'
import CommentTree from '@/components/CommentTree'
import Link from 'next/link'

interface CommentSectionProps {
  storyId: string
  initialComments: NestedComment[]
  isLoggedIn: boolean
}

export default function CommentSection({ storyId, initialComments, isLoggedIn }: CommentSectionProps) {
  const [comments, setComments] = useState<NestedComment[]>(initialComments)

  const handleCommentAdded = (newComment: any) => {
    // Create optimistic comment object
    const optimisticComment: NestedComment = {
      id: newComment.id,
      title: newComment.title,
      slug: newComment.slug,
      type: 'comments', // Changed: Added required type property
      created_at: newComment.created_at,
      modified_at: newComment.modified_at || newComment.created_at, // Changed: Added required modified_at property
      metadata: {
        author: newComment.metadata?.author || 'unknown',
        content: newComment.metadata?.content || '',
        points: newComment.metadata?.points || 0,
        story: newComment.metadata?.story,
        parent_comment: newComment.metadata?.parent_comment
      },
      replies: []
    }
    
    // Add to top-level comments
    setComments(prev => [optimisticComment, ...prev])
  }

  return (
    <>
      {/* Comment form for logged-in users */}
      {isLoggedIn ? (
        <div className="bg-white border border-gray-300 rounded p-4">
          <h3 className="text-sm font-bold mb-3">Add a comment</h3>
          <CommentForm storyId={storyId} onSuccess={handleCommentAdded} />
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
      {comments.length > 0 && (
        <div className="bg-white border border-gray-300 rounded p-4">
          <h2 className="text-lg font-bold mb-4">
            {comments.length} comment{comments.length === 1 ? '' : 's'}
          </h2>
          <CommentTree 
            comments={comments} 
            storyId={storyId}
            isLoggedIn={isLoggedIn}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      )}
      
      {comments.length === 0 && !isLoggedIn && (
        <div className="bg-white border border-gray-300 rounded p-4 text-center text-hn-gray">
          No comments yet. Be the first to comment!
        </div>
      )}
    </>
  )
}