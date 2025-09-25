import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Get all podcast series
export async function getPodcastSeries() {
  try {
    const response = await cosmic.objects
      .find({ type: 'podcast-series' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch podcast series');
  }
}

// Get all episodes
export async function getEpisodes() {
  try {
    const response = await cosmic.objects
      .find({ type: 'episodes' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    // Manual sorting by episode number (descending)
    return response.objects.sort((a: any, b: any) => {
      const episodeA = a.metadata?.episode_number || 0;
      const episodeB = b.metadata?.episode_number || 0;
      return episodeB - episodeA;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch episodes');
  }
}

// Get single episode by slug
export async function getEpisode(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'episodes', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch episode');
  }
}

// Get all participants
export async function getParticipants() {
  try {
    const response = await cosmic.objects
      .find({ type: 'participants' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch participants');
  }
}

// Get recording sessions
export async function getRecordingSessions() {
  try {
    const response = await cosmic.objects
      .find({ type: 'recording-sessions' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    // Manual sorting by session date (descending)
    return response.objects.sort((a: any, b: any) => {
      const dateA = new Date(a.metadata?.session_date || '').getTime();
      const dateB = new Date(b.metadata?.session_date || '').getTime();
      return dateB - dateA;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch recording sessions');
  }
}

// Get quality checks
export async function getQualityChecks() {
  try {
    const response = await cosmic.objects
      .find({ type: 'quality-checks' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    // Manual sorting by review date (descending)
    return response.objects.sort((a: any, b: any) => {
      const dateA = new Date(a.metadata?.review_date || '').getTime();
      const dateB = new Date(b.metadata?.review_date || '').getTime();
      return dateB - dateA;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch quality checks');
  }
}

// Get sponsor segments
export async function getSponsorSegments() {
  try {
    const response = await cosmic.objects
      .find({ type: 'sponsor-segments' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch sponsor segments');
  }
}