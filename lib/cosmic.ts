import { createBucketClient } from '@cosmicjs/sdk'

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

// Fetch comments for a story
export async function getStoryComments(storyId: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'comments',
        'metadata.story': storyId
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(2);
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch comments');
  }
}