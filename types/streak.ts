// Readify — Streak Types (Layer 7)
export interface Streak {
  id: string;
  user_id: string;
  book_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  streak_status: 'active' | 'broken' | 'frozen';
  frozen_until: string | null;
  created_at: string;
}

export interface StreakLog {
  id: string;
  streak_id: string;
  user_date: string;
  target_met: boolean;
  pages_read: number;
  minutes_read: number;
  created_at: string;
}

export type StreakStatus = 'active' | 'broken' | 'frozen';
