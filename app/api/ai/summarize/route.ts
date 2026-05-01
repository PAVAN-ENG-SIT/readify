import { NextResponse } from 'next/server';
import { generateWithRetry } from '@/lib/ai/gemini';

export async function POST(req: Request) {
  try {
    const { text, startPage, endPage } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text argument is required' }, { status: 400 });
    }

    const prompt = `
You are an expert reading assistant part of the BookCult app.
Please summarize the following extracted book content from page ${startPage} to ${endPage}.

Provide the summary following this structure strictly:
1. **Key Ideas**: High-level concepts in bold bullet points.
2. **Simple Explanation**: A concise paragraph explaining the essence of these pages.
3. **Important Concepts**: Any specialized terms, plot points, or arguments made.
4. **Bullet Summary**: A quick chronological summary if applicable.

TEXT:
${text}
`;

    const summary = await generateWithRetry(prompt);

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Summarize API Error:', error);
    
    // Pass custom 503 code if error generated from retries
    if (error.status === 503) {
      return NextResponse.json({ error: 'AI_BUSY' }, { status: 503 });
    }
    
    return NextResponse.json({ error: error.message || 'Failed to generate summary' }, { status: 500 });
  }
}

