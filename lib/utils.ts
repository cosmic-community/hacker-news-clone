import { Comment, NestedComment } from '@/types'

// Build nested comment tree structure
export function buildCommentTree(comments: Comment[]): NestedComment[] {
  const commentMap = new Map<string, NestedComment>();
  const rootComments: NestedComment[] = [];

  // First pass: create map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: build tree structure
  comments.forEach(comment => {
    const nestedComment = commentMap.get(comment.id);
    if (!nestedComment) return;

    const parentId = comment.metadata?.parent_comment?.id;
    
    if (parentId) {
      const parent = commentMap.get(parentId);
      if (parent && parent.replies) {
        parent.replies.push(nestedComment);
      }
    } else {
      rootComments.push(nestedComment);
    }
  });

  return rootComments;
}

// Format time ago
export function timeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
}

// Extract domain from URL
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
}