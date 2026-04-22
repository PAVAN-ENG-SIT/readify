import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { sessionEngine } from '@/lib/reading/sessionEngine';

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { sessionId, endPage, notes, topicTags, chapterRange } = await request.json();
    const session = await sessionEngine.endSession(user.id, sessionId, endPage, notes, topicTags, chapterRange);
    return NextResponse.json({ session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
