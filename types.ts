// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
  thumbnail?: string;
}

// Story type literals matching content model
export type StoryType = 'Link' | 'Text' | 'Ask HN' | 'Show HN';

// Story object with properly typed metadata
export interface Story extends CosmicObject {
  type: 'stories';
  metadata: {
    title: string;
    url?: string;
    content?: string;
    story_type: {
      key: string;
      value: StoryType;
    };
    author: string;
    points: number;
    comment_count: number;
  };
}

// Comment object with properly typed metadata
export interface Comment extends CosmicObject {
  type: 'comments';
  metadata: {
    content: string;
    author: string;
    story?: Story;
    parent_comment?: Comment;
    points: number;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Type guards for runtime validation
export function isStory(obj: CosmicObject): obj is Story {
  return obj.type === 'stories';
}

export function isComment(obj: CosmicObject): obj is Comment {
  return obj.type === 'comments';
}

// Utility types
export type StoryWithComments = Story & {
  comments?: Comment[];
};

export type NestedComment = Comment & {
  replies?: NestedComment[];
};