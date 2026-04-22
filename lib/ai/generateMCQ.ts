// ═══════════════════════════════════════════════════════════
// READIFY — AI MCQ Generator (Layer 8)
// ═══════════════════════════════════════════════════════════

import { genAI, MODEL_NAME } from './gemini';

export const mcqGenerator = {
    generateMCQ: async (text: string) => {
        if (!process.env.GEMINI_API_KEY) return null;
        
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const prompt = `
Generate a single multiple-choice question based on the following text to test reading comprehension.
Format the response in pure JSON (no markdown tags) with the following structure:
{
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Why this is correct"
}

Text:
${text}
        `;
        
        try {
            const result = await model.generateContent(prompt);
            const rawText = result.response.text().trim().replace(/^```json/i, '').replace(/```$/, '');
            return JSON.parse(rawText);
        } catch (e) {
            console.error('[AIEngine] MCQ Generation failed:', e);
            return null;
        }
    }
};
