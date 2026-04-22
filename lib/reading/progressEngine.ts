// ═══════════════════════════════════════════════════════════
// READIFY — Progress Engine (Layer 5 — DERIVED ONLY)
// ═══════════════════════════════════════════════════════════

import { createAdminClient } from '@/lib/supabase/server';
import { eventBus } from '@/lib/events/eventBus';

export const progressEngine = {
  deriveProgress: async (userId: string, bookId: string) => {
    // Admin client is used here because this runs asynchronously 
    // after a session ends (outside the original request context often)
    const supabase = createAdminClient();
    
    // 1. Get all completed sessions for this user+book
    const { data: sessions, error: sessionError } = await supabase
      .from('reading_sessions')
      .select('end_page')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .eq('status', 'completed')
      .order('end_page', { ascending: false });
      
    if (sessionError) throw sessionError;
    
    // 2. Determine highest page read
    const maxPage = sessions?.[0]?.end_page || 0;
    
    // 3. Get book info to calculate percentage
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('total_pages')
      .eq('id', bookId)
      .single();
      
    if (bookError) throw bookError;
    
    const totalPages = book.total_pages || null;
    let progressPercent = 0;
    if (totalPages && totalPages > 0) {
      progressPercent = Math.min(100, (maxPage / totalPages) * 100);
    }
    
    // 4. Update user_books
    const status = progressPercent >= 100 ? 'completed' : 'reading';
    
    const { data: updated, error: updateError } = await supabase
      .from('user_books')
      .update({
        current_page: maxPage,
        progress_percent: progressPercent,
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .select()
      .single();
      
    if (updateError) throw updateError;
    
    // 5. Emit PROGRESS_UPDATED
    eventBus.emit('PROGRESS_UPDATED', {
      userId,
      bookId,
      currentPage: maxPage,
      progressPercent,
      totalPagesRead: maxPage
    }).catch(console.error);
    
    return updated;
  }
};

// ── Event Subscription ──
// Progress depends EXCLUSIVELY on SESSION_END
eventBus.on('SESSION_END', async (payload) => {
  try {
    console.log('[ProgressEngine] Deriving progress for', payload.bookId);
    await progressEngine.deriveProgress(payload.userId, payload.bookId);
  } catch (error) {
    console.error('[ProgressEngine] Failed:', error);
  }
});
