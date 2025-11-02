'use client'

import { useState } from 'react'
import { NestedComment } from '@/types'
import { timeAgo } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import CommentTree from '@/components/CommentTree'

interface CommentItemProps {
  comment: NestedComment
  depth: number
}

export default function CommentItem({ comment, depth }: CommentItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const hasReplies = comment.replies && comment.replies.length > 0
  const indent = depth * 40

  return (
    <div style={{ marginLeft: `${indent}px` }} className="space-y-2">
      <div className="flex items-start gap-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-hn-gray hover:text-gray-900 flex-shrink-0 w-3 text-xs"
        >
          {isCollapsed ? '[+]' : '[-]'}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="hn-subtext flex items-center gap-2 mb-2">
            <span className="font-bold">{comment.metadata?.author || 'unknown'}</span>
            <span>•</span>
            <span>{timeAgo(comment.created_at)}</span>
            <span>•</span>
            <span>{comment.metadata?.points || 0} points</span>
          </div>
          
          {!isCollapsed && (
            <>
              <div className="prose prose-sm max-w-none text-gray-900">
                <ReactMarkdown>{comment.metadata?.content || ''}</ReactMarkdown>
              </div>
              
              {hasReplies && (
                <div className="mt-4">
                  <CommentTree 
                    comments={comment.replies!} 
                    depth={depth + 1}
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