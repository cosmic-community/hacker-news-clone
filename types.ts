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

// User object with properly typed metadata
export interface User extends CosmicObject {
  type: 'users';
  metadata: {
    name: string;
    email: string;
    password_hash: string;
    created_at: string;
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

export function isUser(obj: CosmicObject): obj is User {
  return obj.type === 'users';
}

// Utility types
export type StoryWithComments = Story & {
  comments?: Comment[];
};

export type NestedComment = Comment & {
  replies?: NestedComment[];
};

// Auth types
export interface AuthSession {
  userId: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}