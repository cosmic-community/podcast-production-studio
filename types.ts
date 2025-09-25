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
  status: string;
}

// Podcast Series
export interface PodcastSeries extends CosmicObject {
  type: 'podcast-series';
  metadata: {
    title: string;
    description: string;
    cover_image?: {
      url: string;
      imgix_url: string;
    };
    host?: Participant;
    category?: {
      key: string;
      value: string;
    };
    language?: {
      key: string;
      value: string;
    };
    is_active: boolean;
    rss_feed_settings?: {
      explicit: boolean;
      copyright: string;
      author: string;
      owner_email: string;
      category: string;
      subcategory: string;
    };
  };
}

// Episodes
export interface Episode extends CosmicObject {
  type: 'episodes';
  metadata: {
    title: string;
    podcast_series?: PodcastSeries;
    episode_number: number;
    description: string;
    show_notes?: string;
    cover_image?: {
      url: string;
      imgix_url: string;
    };
    audio_file?: {
      url: string;
    };
    duration?: string;
    publish_date?: string;
    status?: EpisodeStatus;
    transcript?: string;
    participants?: Participant[];
    tags?: string[];
  };
}

// Participants
export interface Participant extends CosmicObject {
  type: 'participants';
  metadata: {
    name: string;
    email: string;
    bio?: string;
    avatar?: {
      url: string;
      imgix_url: string;
    };
    role?: ParticipantRole;
    social_links?: {
      twitter?: string;
      linkedin?: string;
      website?: string;
      research?: string;
      instagram?: string;
      portfolio?: string;
    };
    audio_setup_notes?: string;
    is_active: boolean;
  };
}

// Recording Sessions
export interface RecordingSession extends CosmicObject {
  type: 'recording-sessions';
  metadata: {
    title: string;
    episode?: Episode;
    session_date: string;
    duration?: number;
    status?: SessionStatus;
    participants?: Participant[];
    recording_quality?: RecordingQuality;
    session_notes?: string;
    technical_issues?: string;
    backup_recordings?: any[];
  };
}

// Audio Clips
export interface AudioClip extends CosmicObject {
  type: 'audio-clips';
  metadata: {
    title: string;
    episode?: Episode;
    audio_file?: {
      url: string;
    };
    start_time: number;
    end_time: number;
    clip_type?: ClipType;
    notes?: string;
    is_included: boolean;
    order_position?: number;
  };
}

// Quality Checks
export interface QualityCheck extends CosmicObject {
  type: 'quality-checks';
  metadata: {
    title: string;
    episode?: Episode;
    audio_quality_check?: string[];
    content_review?: string[];
    approval_status?: ApprovalStatus;
    reviewer_notes?: string;
    reviewed_by?: Participant;
    review_date?: string;
  };
}

// Sponsor Segments
export interface SponsorSegment extends CosmicObject {
  type: 'sponsor-segments';
  metadata: {
    title: string;
    sponsor_name: string;
    ad_copy: string;
    audio_spot?: {
      url: string;
    };
    placement?: SponsorPlacement;
    campaign_start_date: string;
    campaign_end_date: string;
    target_episodes?: Episode[];
    is_active: boolean;
  };
}

// Type literals for select-dropdown values
export type EpisodeStatus = 'draft' | 'recording' | 'editing' | 'review' | 'published';
export type ParticipantRole = 'host' | 'cohost' | 'guest' | 'producer';
export type SessionStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';
export type RecordingQuality = 'standard' | 'high' | 'broadcast';
export type ClipType = 'intro' | 'content' | 'outro' | 'ad' | 'transition' | 'music';
export type ApprovalStatus = 'pending' | 'approved' | 'needs_work' | 'rejected';
export type SponsorPlacement = 'pre_roll' | 'mid_roll' | 'post_roll';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Utility types
export type CreateEpisodeData = Omit<Episode, 'id' | 'created_at' | 'modified_at' | 'status'>;
export type CreateRecordingSessionData = Omit<RecordingSession, 'id' | 'created_at' | 'modified_at' | 'status'>;