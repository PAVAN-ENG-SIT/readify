// ═══════════════════════════════════════════════════════════
// READIFY — Streak Engine (Layer 7)
// ═══════════════════════════════════════════════════════════

import { createAdminClient } from '@/lib/supabase/server';
import { eventBus } from '@/lib/events/eventBus';
import { toUserLocalDate } from '@/lib/utils/date';

export const streakEngine = {
  evaluateSession: async (userId: string, durationSeconds: number, pagesRead: number) => {
    const supabase = createAdminClient();
    
    // 1. Get user timezone
    const { data: profile } = await supabase.from('profiles').select('timezone').eq('id', userId).single();
    const tz = profile?.timezone || 'UTC';
    
    // 2. Get local date safely
    const localDateStr = toUserLocalDate(new Date(), tz).split('T')[0];
    
    // 3. Upsert streak_logs for today (graceful fallback if RPC doesn't exist)
    const { data: existingLog } = await supabase.from('streak_logs')
        .select('*').eq('user_id', userId).eq('activity_date', localDateStr).single();
        
    if (existingLog) {
        await supabase.from('streak_logs').update({
            pages_read: existingLog.pages_read + pagesRead,
            duration_seconds: existingLog.duration_seconds + durationSeconds
        }).eq('id', existingLog.id);
    } else {
        await supabase.from('streak_logs').insert({
            user_id: userId,
            activity_date: localDateStr,
            pages_read: pagesRead,
            duration_seconds: durationSeconds
        });
    }
    
    // 4. Update streaks table
    const { data: streak } = await supabase.from('streaks').select('*').eq('user_id', userId).single();
    
    const today = new Date(localDateStr);
    let newCurrent = 1;
    let newLongest = 1;
    
    if (streak && streak.last_activity_date) {
        const lastDate = new Date(streak.last_activity_date);
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            // Already active today
            newCurrent = streak.current_streak;
            newLongest = streak.longest_streak;
        } else if (diffDays === 1) {
            // Consecutive day
            newCurrent = streak.current_streak + 1;
            newLongest = Math.max(streak.longest_streak, newCurrent);
        } else {
            // Streak broken
            newCurrent = 1;
            newLongest = streak.longest_streak;
        }
    }
    
    if (streak) {
        await supabase.from('streaks').update({
            current_streak: newCurrent,
            longest_streak: newLongest,
            last_activity_date: localDateStr
        }).eq('user_id', userId);
    } else {
        await supabase.from('streaks').insert({
            user_id: userId,
            current_streak: newCurrent,
            longest_streak: newLongest,
            last_activity_date: localDateStr
        });
    }
    
    eventBus.emit('STREAK_EVALUATED', {
        userId,
        currentStreak: newCurrent,
        gainedStreak: newCurrent > (streak?.current_streak || 0)
    }).catch(console.error);
    
    return { currentStreak: newCurrent };
  }
};

// ── Event Subscription ──
eventBus.on('SESSION_END', async (payload) => {
    try {
        console.log('[StreakEngine] Evaluating session for', payload.userId);
        await streakEngine.evaluateSession(payload.userId, payload.durationSeconds, payload.pagesRead);
    } catch (e) {
        console.error('[StreakEngine] Failed:', e);
    }
});
