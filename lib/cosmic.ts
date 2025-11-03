import { createBucketClient } from '@cosmicjs/sdk'
import { User } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all stories
export async function getStories() {
  try {
    const response = await cosmic.objects
      .find({ type: 'stories' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch stories');
  }
}

// Fetch stories by type
export async function getStoriesByType(storyType: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'stories',
        'metadata.story_type.key': storyType
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch stories by type');
  }
}

// Fetch a single story
export async function getStory(slug: string) {
  try {
    const response = await cosmic.objects.findOne({
      type: 'stories',
      slug
    }).props(['id', 'title', 'slug', 'metadata', 'created_at']).depth(1);
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch story');
  }
}

// Fetch comments for a story - query object relationships by ID only
export async function getStoryComments(storyId: string) {
  try {
    // For object relationship metafields, query by the field name directly with the object ID
    // The query format should be 'metadata.story' with just the ID value
    const response = await cosmic.objects
      .find({ 
        type: 'comments',
        'metadata.story': storyId
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(2); // Depth 2 to get parent_comment relationships
    
    console.log('Fetched comments for story:', storyId, 'Count:', response.objects.length);
    console.log('Sample comment metadata:', response.objects[0]?.metadata);
    return response.objects;
  } catch (error) {
    console.error('Error fetching comments:', error);
    if (hasStatus(error) && error.status === 404) {
      console.log('No comments found (404) for story:', storyId);
      return [];
    }
    throw new Error('Failed to fetch comments');
  }
}

// User authentication functions

// Find user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'users',
        'metadata.email': email
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(0);
    
    if (response.objects && response.objects.length > 0) {
      return response.objects[0] as User;
    }
    return null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch user');
  }
}

// Find user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await cosmic.objects.findOne({
      id
    }).props(['id', 'title', 'slug', 'metadata', 'created_at']).depth(0);
    
    return response.object as User;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch user');
  }
}

// Create a new user
export async function createUser(name: string, email: string, passwordHash: string): Promise<User> {
  try {
    const response = await cosmic.objects.insertOne({
      title: name,
      type: 'users',
      metadata: {
        name,
        email,
        password_hash: passwordHash,
        created_at: new Date().toISOString()
      }
    });
    
    return response.object as User;
  } catch (error) {
    throw new Error('Failed to create user');
  }
}

// Update user profile
export async function updateUser(id: string, name: string, email: string): Promise<User> {
  try {
    const response = await cosmic.objects.updateOne(id, {
      title: name,
      metadata: {
        name,
        email
      }
    });
    
    return response.object as User;
  } catch (error) {
    throw new Error('Failed to update user');
  }
}