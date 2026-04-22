import { NextResponse } from 'next/server';
import { GOOGLE_BOOKS_API_URL, MAX_SEARCH_RESULTS } from '@/lib/utils/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ items: [] });
  }

  try {
    const res = await fetch(`${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(q)}&maxResults=${MAX_SEARCH_RESULTS}`);
    const data = await res.json();

    const items = (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || 'Unknown Author',
      cover_url: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
      total_pages: item.volumeInfo.pageCount || null,
      description: item.volumeInfo.description || null,
      isbn: item.volumeInfo.industryIdentifiers?.find((i: any) => i.type === 'ISBN_13' || i.type === 'ISBN_10')?.identifier || null,
    }));

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
