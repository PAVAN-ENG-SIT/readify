// Readify — Session Types (Layer 4)
export interface ReadingSession {
  id: string;
  user_id: string;
  book_id: string;
  status: 'active' | 'completed' | 'abandoned' | 'crashed';
  started_at: string;
  ended_at: string | null;
  pages_read: number;
  start_page: number;
  end_page: number;
  duration_seconds: number;
  idle_seconds: number;
  last_heartbeat: string;
  notes: string | null;
  topic_tags: string[];
  chapter_range: string | null;
  created_at: string;
}

export interface SessionState {
  isActive: boolean;
  sessionId: string | null;
  bookId: string | null;
  startPage: number;
  elapsedSeconds: number;
  idleSeconds: number;
  isPaused: boolean;
}
