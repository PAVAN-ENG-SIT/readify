// Readify — Book Types (Layer 3)
export interface Book {
  id: string;
  title: string;
  author?: string;
  cover_url?: string;
  total_pages?: number;
  total_chapters?: number;
  chapter_titles?: string[];
  description?: string;
  genre?: string[];
  isbn?: string;
  source?: string;
  file_url?: string;
}

export interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  status: 'reading' | 'completed' | 'paused' | 'abandoned';
  current_page: number;
  current_chapter: number;
  progress_percent: number;
  added_at: string;
  completed_at: string | null;
  book?: Book;
}

export interface BookSearchResult {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  total_pages: number | null;
  description: string | null;
  isbn: string | null;
  source?: string;
  file_url?: string | null;
}
