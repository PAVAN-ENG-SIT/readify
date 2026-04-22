import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'AI Insights — coming soon' }, { status: 501 });
}
