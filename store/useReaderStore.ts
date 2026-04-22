import { create } from 'zustand';

interface ReaderState {
  isPanelOpen: boolean;
  activeBookId: string | null;
  openPanel: (bookId: string) => void;
  closePanel: () => void;
}

export const useReaderStore = create<ReaderState>((set) => ({
  isPanelOpen: false,
  activeBookId: null,
  
  openPanel: (bookId) => set({ isPanelOpen: true, activeBookId: bookId }),
  closePanel: () => set({ isPanelOpen: false, activeBookId: null })
}));
