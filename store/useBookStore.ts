import { create } from 'zustand';
import type { UserBook, BookSearchResult } from '@/types/book';

interface BookState {
  userBooks: UserBook[];
  isLoading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  addBook: (book: BookSearchResult) => Promise<void>;
  updateBookStatus: (userBookId: string, status: UserBook['status']) => Promise<void>;
  removeBook: (userBookId: string) => Promise<void>;
}

export const useBookStore = create<BookState>((set, get) => ({
  userBooks: [],
  isLoading: false,
  error: null,

  fetchBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/books');
      if (!res.ok) throw new Error('Failed to fetch books');
      const data = await res.json();
      set({ userBooks: data.books || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addBook: async (book: BookSearchResult) => {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookData: book }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add book');
      }
      await get().fetchBooks();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateBookStatus: async (userBookId, status) => {
    try {
      const res = await fetch(`/api/books/${userBookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      await get().fetchBooks();
    } catch (error: any) {
      throw error;
    }
  },

  removeBook: async (userBookId) => {
    try {
      const res = await fetch(`/api/books/${userBookId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
         const errorData = await res.json();
         throw new Error(errorData.error || 'Failed to remove book');
      }
      await get().fetchBooks();
    } catch (error: any) {
      throw error;
    }
  }
}));
