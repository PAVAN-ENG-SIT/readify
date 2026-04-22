// Readify — User Types (Layer 1)
export interface UserProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  timezone: string;
  reading_preferences: Record<string, unknown>;
  onboarded: boolean;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}
