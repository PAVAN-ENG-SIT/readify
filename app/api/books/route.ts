import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('user_books')
    .select(`
      *,
      book:books (*)
    `)
    .order('added_at', { ascending: false })
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ books: data });
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { bookData } = await request.json();
    
    // 1. Ensure book exists in public.books by checking ISBN or exact title/author
    let bookId = bookData.id; 
    let existingBook = null;

    if (bookData.isbn && bookData.source !== 'upload') {
        const { data } = await supabase.from('books').select('id').eq('isbn', bookData.isbn).maybeSingle();
        existingBook = data;
    } 
    
    if (!existingBook && bookData.source !== 'upload') {
        const { data } = await supabase.from('books')
          .select('id')
          .eq('title', bookData.title)
          .eq('author', bookData.author)
          .maybeSingle();
        existingBook = data;
    }
    
    if (existingBook) {
      bookId = existingBook.id;
    } else {
      const { data: newBook, error: bookError } = await supabase.from('books').insert({
        title: bookData.title,
        author: bookData.author,
        cover_url: bookData.cover_url,
        total_pages: bookData.total_pages || 1,
        description: bookData.description,
        isbn: bookData.isbn,
        source: bookData.source || 'google',
        file_url: bookData.file_url || null
      }).select('id').single();
      
      if (bookError) throw bookError;
      bookId = newBook.id;
    }

    // 2. Add to user_books
    const { data: ub, error: ubError } = await supabase.from('user_books').insert({
      user_id: user.id,
      book_id: bookId,
      status: 'reading',
      current_page: 0,
      progress_percent: 0
    }).select().single();

    if (ubError) {
        // if user already added it
        if (ubError.code === '23505') {
            return NextResponse.json({ error: 'Book already in your library' }, { status: 400 });
        }
        throw ubError;
    }

    return NextResponse.json({ success: true, userBook: ub });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
