// ═══════════════════════════════════════════════════════════
// READIFY — Gemini AI Engine (Layer 8)
// ═══════════════════════════════════════════════════════════

import { GoogleGenerativeAI } from '@google/generativeai';

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
export const MODEL_NAME = 'gemini-1.5-pro';
