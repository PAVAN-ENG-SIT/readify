// ═══════════════════════════════════════════════════════════
// READIFY — Profile API Route (Layer 2)
// ═══════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { timezone, onboarded, reading_preferences, name } = body;

    const updates: any = {};
    if (timezone !== undefined) updates.timezone = timezone;
    if (onboarded !== undefined) updates.onboarded = onboarded;
    if (reading_preferences !== undefined) updates.reading_preferences = reading_preferences;
    if (name !== undefined) updates.name = name;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
