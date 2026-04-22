import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function PATCH(request: Request, { params }: { params: { userBookId: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { status } = await request.json();
    const { error } = await supabase
      .from('user_books')
      .update({ status })
      .eq('id', params.userBookId)
      .eq('user_id', user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { userBookId: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // 1. First, fetch the book metadata to check if we need to clean up the Supabase storage bucket
    const { data: ubData, error: fetchError } = await supabase
      .from('user_books')
      .select('book_id, books(file_url, source)')
      .eq('id', params.userBookId)
      .eq('user_id', user.id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Delete the user's connection to the book
    const { error } = await supabase
      .from('user_books')
      .delete()
      .eq('id', params.userBookId)
      .eq('user_id', user.id);

    if (error) throw error;

    // 3. Clean up the literal file from the 'ebooks' bucket if they uploaded it
    const book = ubData.books as any;
    if (book && book.source === 'upload' && book.file_url) {
        if (book.file_url.includes('/ebooks/')) {
            const filePath = book.file_url.split('/ebooks/')[1]; // yields "userId/fileName.epub"
            
            // Security check: Only allow them to delete files from their own storage folder
            if (filePath.startsWith(`${user.id}/`)) {
                await supabase.storage.from('ebooks').remove([filePath]);
            }
        }
        // Because uploads are isolated to the uploading user, we can safely delete the global book record too
        await supabase.from('books').delete().eq('id', ubData.book_id);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete Book Pipeline Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
