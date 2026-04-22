import { create } from 'zustand';

interface SessionState {
  isActive: boolean;
  sessionId: string | null;
  bookId: string | null;
  startPage: number;
  elapsedSeconds: number;
  idleSeconds: number;
  isPaused: boolean;
  
  startSession: (bookId: string, startPage: number) => Promise<void>;
  endSession: (endPage: number, notes?: string, topicTags?: string[], chapterRange?: string) => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  incrementTime: () => void;
  incrementIdle: () => void;
  resetIdle: () => void;
  sendHeartbeat: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  isActive: false,
  sessionId: null,
  bookId: null,
  startPage: 0,
  elapsedSeconds: 0,
  idleSeconds: 0,
  isPaused: false,

  startSession: async (bookId, startPage) => {
    try {
      const res = await fetch('/api/sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, startPage })
      });
      if (!res.ok) throw new Error('Failed to start session');
      const data = await res.json();
      set({
        isActive: true,
        sessionId: data.session.id,
        bookId,
        startPage,
        elapsedSeconds: 0,
        idleSeconds: 0,
        isPaused: false
      });
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  },

  endSession: async (endPage, notes, topicTags, chapterRange) => {
    const { sessionId } = get();
    if (!sessionId) return;
    try {
      const res = await fetch('/api/sessions/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, endPage, notes, topicTags, chapterRange })
      });
      if (!res.ok) throw new Error('Failed to end session');
      set({
        isActive: false,
        sessionId: null,
        bookId: null,
        startPage: 0,
        elapsedSeconds: 0,
        idleSeconds: 0,
        isPaused: false
      });
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  },

  pauseSession: () => set({ isPaused: true }),
  resumeSession: () => set({ isPaused: false, idleSeconds: 0 }),
  
  incrementTime: () => {
    const state = get();
    if (state.isActive && !state.isPaused) {
      set({ elapsedSeconds: state.elapsedSeconds + 1 });
    }
  },
  
  incrementIdle: () => {
    const state = get();
    if (state.isActive && !state.isPaused) {
      set({ idleSeconds: state.idleSeconds + 1 });
    }
  },
  
  resetIdle: () => {
    set({ idleSeconds: 0 });
  },

  sendHeartbeat: async () => {
    const { sessionId, elapsedSeconds, idleSeconds, isActive } = get();
    if (!isActive || !sessionId) return;
    
    try {
      await fetch('/api/sessions/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, elapsedSeconds, idleSeconds })
      });
    } catch (error) {
      console.error('Failed to send heartbeat', error);
    }
  }
}));
