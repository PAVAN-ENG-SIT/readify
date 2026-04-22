// ═══════════════════════════════════════════════════════════
// READIFY — AI Summary Engine (Layer 8)
// ═══════════════════════════════════════════════════════════

import { genAI, MODEL_NAME } from './gemini';
import { createAdminClient } from '@/lib/supabase/server';
import { eventBus } from '@/lib/events/eventBus';

export const aiSummarizer = {
    generateSummary: async (sessionId: string, userId: string, bookId: string, notes?: string) => {
        if (!process.env.GEMINI_API_KEY) {
             console.warn('[AIEngine] Skipped summary: Missing API Key');
             return null;
        }
        
        const supabase = createAdminClient();
        
        // 1. Get book details
        const { data: book } = await supabase.from('books').select('title, author, description').eq('id', bookId).single();
        if (!book) return null;
        
        // 2. Fetch recent sessions context
        const { data: recentSessions } = await supabase.from('reading_sessions')
            .select('pages_read, notes, chapter_range')
            .eq('user_id', userId)
            .eq('book_id', bookId)
            .eq('status', 'completed')
            .order('ended_at', { ascending: false })
            .limit(5);

        // 3. Construct prompt
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const recentContext = recentSessions?.map(s => `Read ${s.pages_read} pages. Notes: ${s.notes || 'None'}`).join('\n') || '';
        
        const prompt = `
You are a reading companion for the Readify app. Summarize a user's latest reading session for the book "${book.title}" by ${book.author}.

Context of recent sessions:
${recentContext}

User notes from this session:
${notes || 'No specific notes provided.'}

Provide a brief, encouraging, 2-3 sentence summary/insight. Connect their session to the broader themes of the book. 
Write it in a premium, engaging tone. Do not use generic praise.
        `;

        try {
            const result = await model.generateContent(prompt);
            const summaryText = result.response.text();
            
            // 4. Save to DB
            const { data: generatedSummary } = await supabase.from('ai_summaries').insert({
                user_id: userId,
                book_id: bookId,
                session_id: sessionId,
                summary_text: summaryText,
                source_type: 'session'
            }).select().single();
            
            // 5. Emit Event
            eventBus.emit('AI_SUMMARY_GENERATED', {
                sessionId,
                summaryId: generatedSummary?.id
            }).catch(console.error);

            return generatedSummary;
            
        } catch (error) {
            console.error('[AIEngine] Generation failed:', error);
            return null; // Silent catch, failure isolation rule
        }
    }
};

// ── Event Subscription ──
eventBus.on('SESSION_END', async (payload) => {
    try {
        console.log('[AIEngine] Starting background summary for session:', payload.sessionId);
        await aiSummarizer.generateSummary(payload.sessionId, payload.userId, payload.bookId, payload.notes);
    } catch (e) {
        console.error('[AIEngine] Processing Failed:', e);
    }
});
