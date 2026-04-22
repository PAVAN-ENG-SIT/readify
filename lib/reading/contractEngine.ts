// ═══════════════════════════════════════════════════════════
// READIFY — Contract Engine (Layer 6)
// ═══════════════════════════════════════════════════════════

import { createAdminClient } from '@/lib/supabase/server';
import { eventBus } from '@/lib/events/eventBus';

export const contractEngine = {
  createContract: async (userId: string, bookId: string, dailyTargetPages?: number, dailyTargetMinutes?: number, enforcementMode: 'soft' | 'strict' = 'soft') => {
    const supabase = createAdminClient();
    const { data: contract, error } = await supabase
      .from('reading_contracts')
      .insert({
        user_id: userId,
        book_id: bookId,
        daily_target_pages: dailyTargetPages,
        daily_target_minutes: dailyTargetMinutes,
        enforcement_mode: enforcementMode,
        status: 'active'
      })
      .select()
      .single();
    if (error) throw error;
    return contract;
  },

  evaluateContract: async (userId: string, bookId: string, userDate: string) => {
    const supabase = createAdminClient();
    const { data: contract, error } = await supabase
      .from('reading_contracts')
      .select('*')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .eq('status', 'active')
      .single();
      
    if (error || !contract) return null; // No active contract

    // Timezone safe range for the userDate needs specific calculations
    // For simplicity we'll assume userDate is ISO YYYY-MM-DD
    const { data: sessions } = await supabase
      .from('reading_sessions')
      .select('pages_read, duration_seconds, ended_at')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .eq('status', 'completed')
      .gte('ended_at', `${userDate}T00:00:00Z`) 
      .lte('ended_at', `${userDate}T23:59:59Z`);

    const dailyPages = sessions?.reduce((sum, s) => sum + (s.pages_read || 0), 0) || 0;
    const dailyMinutes = (sessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0) / 60;
    
    let targetMet = false;
    
    // Evaluate if target met
    if (contract.daily_target_pages && dailyPages >= contract.daily_target_pages) targetMet = true;
    if (contract.daily_target_minutes && dailyMinutes >= contract.daily_target_minutes) targetMet = true;

    eventBus.emit('CONTRACT_EVALUATED', {
      userId,
      bookId,
      contractId: contract.id,
      dailyTargetMet: targetMet,
      weeklyTargetMet: false // stub for weekly soft mode evaluate
    }).catch(console.error);

    return { targetMet, dailyPages, dailyMinutes };
  }
};
