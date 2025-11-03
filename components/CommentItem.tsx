'use client'

import { useState } from 'react'
import { NestedComment } from '@/types'
import { timeAgo } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import CommentTree from '@/components/CommentTree'
import CommentForm from '@/components/CommentForm'

interface CommentItemProps {
  comment: NestedComment
  depth: number
  storyId: string
  isLoggedIn: boolean
  onCommentAdded?: (comment: any) => void
}

export default function CommentItem({ comment, depth, storyId, isLoggedIn, onCommentAdded }: CommentItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [optimisticReplies, setOptimisticReplies] = useState<NestedComment[]>([])
  const hasReplies = (comment.replies && comment.replies.length > 0) || optimisticReplies.length > 0
  const indent = depth * 40

  // Safely access comment metadata
  const author = comment.metadata?.author || 'unknown'
  const content = comment.metadata?.content || ''
  const points = comment.metadata?.points || 0

  const handleReplySuccess = (newComment: any) => {
    setShowReplyForm(false)
    
    // Add the new comment optimistically to the UI
    const optimisticComment: NestedComment = {
      id: newComment.id,
      title: newComment.title,
      slug: newComment.slug,
      created_at: newComment.created_at,
      metadata: {
        author: newComment.metadata?.author || 'unknown',
        content: newComment.metadata?.content || '',
        points: newComment.metadata?.points || 0,
        story: newComment.metadata?.story,
        parent_comment: newComment.metadata?.parent_comment
      },
      replies: []
    }
    
    setOptimisticReplies(prev => [...prev, optimisticComment])
    
    // Notify parent component
    if (onCommentAdded) {
      onCommentAdded(newComment)
    }
  }

  // Combine actual replies with optimistic replies
  const allReplies = [...(comment.replies || []), ...optimisticReplies]

  return (
    <div style={{ marginLeft: `${indent}px` }} className="space-y-2">
      <div className="flex items-start gap-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-hn-gray hover:text-gray-900 flex-shrink-0 w-3 text-xs"
          aria-label={isCollapsed ? 'Expand comment' : 'Collapse comment'}
        >
          {isCollapsed ? '[+]' : '[-]'}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="hn-subtext flex items-center gap-2 mb-2">
            <span className="font-bold">{author}</span>
            <span>•</span>
            <span>{timeAgo(comment.created_at)}</span>
            {points > 0 && (
              <>
                <span>•</span>
                <span>{points} points</span>
              </>
            )}
          </div>
          
          {!isCollapsed && (
            <>
              <div className="prose prose-sm max-w-none text-gray-900">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
              
              {/* Reply button for logged-in users */}
              {isLoggedIn && !showReplyForm && (
                <button
                  onClick={() => setShowReplyForm(true)}
                  className="text-hn-gray hover:text-gray-900 text-xs mt-2"
                >
                  reply
                </button>
              )}

              {/* Reply form */}
              {showReplyForm && (
                <div className="mt-3 pl-4 border-l-2 border-gray-200">
                  <CommentForm 
                    storyId={storyId}
                    parentCommentId={comment.id}
                    onSuccess={handleReplySuccess}
                  />
                  <button
                    onClick={() => setShowReplyForm(false)}
                    className="text-hn-gray hover:text-gray-900 text-xs mt-2"
                  >
                    cancel
                  </button>
                </div>
              )}
              
              {hasReplies && (
                <div className="mt-4">
                  <CommentTree 
                    comments={allReplies} 
                    depth={depth + 1}
                    storyId={storyId}
                    isLoggedIn={isLoggedIn}
                    onCommentAdded={onCommentAdded}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}