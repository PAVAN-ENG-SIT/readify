// ═══════════════════════════════════════════════════════════
// READIFY — AI Insights Generator (Layer 8)
// ═══════════════════════════════════════════════════════════

import { genAI, MODEL_NAME } from './gemini';
import { createAdminClient } from '@/lib/supabase/server';

export const aiInsights = {
    generateWeeklyInsights: async (userId: string) => {
        if (!process.env.GEMINI_API_KEY) return null;
        
        const supabase = createAdminClient();
        
        // Fetch last 7 days of reading logs
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data: logs } = await supabase.from('streak_logs')
            .select('*')
            .eq('user_id', userId)
            .gte('activity_date', sevenDaysAgo.toISOString());
            
        // Construct prompt with log data to generate pattern insights
        // stub logic
        console.log('[AIEngine] Extracted weekly data: ', logs?.length, 'logs');
        
        return { message: "insights feature in development" };
    }
};
