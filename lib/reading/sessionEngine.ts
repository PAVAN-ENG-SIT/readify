// ═══════════════════════════════════════════════════════════
// READIFY — Session Engine (Layer 4 — CORE)
// ═══════════════════════════════════════════════════════════

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { eventBus } from '@/lib/events/eventBus';
import { SESSION_CRASH_THRESHOLD_MS } from '@/lib/utils/constants';

export const sessionEngine = {
  startSession: async (userId: string, bookId: string, startPage: number) => {
    const supabase = createServerSupabaseClient();

    // 1. Recover any crashed sessions first
    await sessionEngine.handleCrashRecovery(userId);

    // 2. Start new session
    const { data: session, error } = await supabase
      .from('reading_sessions')
      .insert({
        user_id: userId,
        book_id: bookId,
        start_page: startPage,
        status: 'active',
        last_heartbeat: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // 3. Emit event
    // Note: await emit to ensure any synchronous validations/setups in handlers complete
    await eventBus.emit('SESSION_START', {
      sessionId: session.id,
      userId,
      bookId,
      startPage
    });

    return session;
  },

  heartbeat: async (userId: string, sessionId: string, elapsedSeconds: number, idleSeconds: number) => {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('reading_sessions')
      .update({
        last_heartbeat: new Date().toISOString(),
        duration_seconds: elapsedSeconds,
        idle_seconds: idleSeconds
      })
      .eq('id', sessionId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .select()
      .single();
      
    if (error) throw error;
    
    await eventBus.emit('SESSION_HEARTBEAT', {
      sessionId,
      elapsedSeconds,
      idleSeconds
    });
    
    return data;
  },

  endSession: async (
    userId: string, 
    sessionId: string, 
    endPage: number, 
    notes?: string, 
    topicTags?: string[], 
    chapterRange?: string
  ) => {
    const supabase = createServerSupabaseClient();
    
    const { data: session, error: getError } = await supabase
      .from('reading_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
      
    if (getError || !session) throw new Error('Session not found');
    if (session.status !== 'active') throw new Error('Session is not active');
    
    const pagesRead = Math.max(0, endPage - session.start_page);
    
    const { data: updatedSession, error } = await supabase
      .from('reading_sessions')
      .update({
        status: 'completed',
        end_page: endPage,
        pages_read: pagesRead,
        ended_at: new Date().toISOString(),
        notes: notes || null,
        topic_tags: topicTags || [],
        chapter_range: chapterRange || null
      })
      .eq('id', sessionId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .select()
      .single();
      
    if (error) throw error;
    
    // Fire and forget (failure isolations rules)
    eventBus.emit('SESSION_END', {
      sessionId,
      userId,
      bookId: updatedSession.book_id,
      pagesRead,
      startPage: updatedSession.start_page,
      endPage,
      durationSeconds: updatedSession.duration_seconds,
      idleSeconds: updatedSession.idle_seconds,
      notes: updatedSession.notes,
      topicTags: updatedSession.topic_tags,
      chapterRange: updatedSession.chapter_range
    }).catch(console.error);
    
    return updatedSession;
  },

  handleCrashRecovery: async (userId: string) => {
    const supabase = createServerSupabaseClient();
    const cutoffTime = new Date(Date.now() - SESSION_CRASH_THRESHOLD_MS).toISOString();
    
    const { data: crashedSessions } = await supabase
      .from('reading_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .lt('last_heartbeat', cutoffTime);
      
    if (!crashedSessions || crashedSessions.length === 0) return;
    
    // Mark them as crashed
    for (const session of crashedSessions) {
      await supabase
        .from('reading_sessions')
        .update({ status: 'crashed' })
        .eq('id', session.id);
    }
  }
};
