import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { contractEngine } from '@/lib/reading/contractEngine';

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { bookId, dailyTargetPages, dailyTargetMinutes, enforcementMode } = await request.json();
    const contract = await contractEngine.createContract(user.id, bookId, dailyTargetPages, dailyTargetMinutes, enforcementMode);
    return NextResponse.json({ contract });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get('bookId');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let query = supabase.from('reading_contracts').select('*, book:books(*)').eq('user_id', user.id);
  if (bookId) query = query.eq('book_id', bookId);

  const { data: contracts, error } = await query.order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ contracts });
}
