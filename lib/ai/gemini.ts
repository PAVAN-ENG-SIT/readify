// ═══════════════════════════════════════════════════════════
// READIFY — Gemini AI Engine (Layer 8)
// ═══════════════════════════════════════════════════════════

import { GoogleGenerativeAI } from '@google/generative-ai';

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
export const MODEL_NAME = 'gemini-2.5-flash';
export const FALLBACK_MODEL_NAME = 'gemini-2.5-flash-lite';

async function callGemini(prompt: string, modelName: string, retries: number): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err: any) {
        if (retries === 0) throw err;
        console.warn(`[AIEngine] ${modelName} failed. Retrying... (${retries} left). Error:`, err.message);
        await new Promise(res => setTimeout(res, 2000));
        return callGemini(prompt, modelName, retries - 1);
    }
}

export async function generateWithRetry(prompt: string): Promise<string> {
    try {
        // Try primary model with 2 retries (total 3 attempts)
        return await callGemini(prompt, MODEL_NAME, 2);
    } catch (primaryErr: any) {
        console.warn('[AIEngine] Primary model failed entirely. Error:', primaryErr.message);
        try {
             // Try fallback model with 1 retry (total 2 attempts)
             console.log('[AIEngine] Switching to fallback model:', FALLBACK_MODEL_NAME);
             return await callGemini(prompt, FALLBACK_MODEL_NAME, 1);
        } catch (fallbackErr: any) {
             console.error('[AIEngine] Fallback model also failed.');
             const err = new Error('Service Unavailable');
             (err as any).status = 503;
             throw err;
        }
    }
}
