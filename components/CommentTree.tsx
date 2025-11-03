import { NestedComment } from '@/types'
import CommentItem from '@/components/CommentItem'

interface CommentTreeProps {
  comments: NestedComment[]
  depth?: number
  storyId: string
  isLoggedIn: boolean
}

export default function CommentTree({ comments, depth = 0, storyId, isLoggedIn }: CommentTreeProps) {
  if (!comments || comments.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <CommentItem 
          key={comment.id} 
          comment={comment}
          depth={depth}
          storyId={storyId}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  )
}