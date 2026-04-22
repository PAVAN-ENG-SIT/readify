'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useBookStore } from '@/store/useBookStore';
import Button from '@/components/ui/Button';
import type { BookSearchResult } from '@/types/book';
import { createClient } from '@/lib/supabase/client';

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function BooksPage() {
  const { userBooks, fetchBooks, isLoading, addBook, removeBook, error } = useBookStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const searchGoogleBooks = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setSearchResults(data.items || []);
    } catch (e: any) {
      console.error('Failed to search books:', e);
      setAddError(e.message);
    } finally {
      setIsSearching(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(searchGoogleBooks, 400), []);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleAddBook = async (book: BookSearchResult) => {
    setAddError(null);
    try {
        await addBook(book);
        setShowSearch(false);
        setSearchQuery('');
    } catch (e: any) {
        setAddError(e.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      setAddError(null);

      try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('ebooks')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: pbUrlData } = supabase.storage.from('ebooks').getPublicUrl(filePath);
          const file_url = pbUrlData.publicUrl;

          const bookData: BookSearchResult = {
              id: `upload-${Date.now()}`,
              title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
              author: "Unknown Author",
              cover_url: null,
              total_pages: 1, // Fallback to 1 if we don't know the pages (to pass check constraint > 0)
              description: "Uploaded via Readify",
              isbn: null,
              source: 'upload',
              file_url: file_url
          };

          await addBook(bookData);
          alert("Book uploaded and added to library successfully!");
          
      } catch (err: any) {
          console.error("Upload error:", err);
          setAddError(err.message || 'Error uploading file. Are you sure the "ebooks" bucket is created and public?');
      } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
      }
  };

  return (
    <div className="books-page animate-fade-in">
      <div className="header">
        <h1 className="page-title">Your Library</h1>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <Button onClick={() => setShowSearch(!showSearch)}>
              {showSearch ? 'Close Search' : 'Find Book'}
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{display: 'none'}} 
              accept=".epub,.pdf" 
              onChange={handleFileUpload}
            />
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} isLoading={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload .epub / .pdf'}
            </Button>
        </div>
      </div>

      {addError && (
          <div className="error-text" style={{ marginBottom: 'var(--sp-4)', padding: 'var(--sp-4)', background: 'rgba(255,100,100,0.1)', borderRadius: 'var(--radius-md)', color: '#ff6b6b' }}>
              ⚠ {addError}
          </div>
      )}

      {showSearch && (
        <div className="search-section glass animate-fade-in-up">
          <input
            className="input"
            placeholder="Search typing a title (e.g. 'Dune', 'Atomic Habits')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {isSearching ? (
            <p className="search-status text-muted">Searching Google Books...</p>
          ) : (
            <div className="search-results">
              {searchResults.length === 0 && searchQuery.length > 2 && !isSearching && (
                 <p className="search-status text-muted">No books found for "{searchQuery}". Try a different title.</p>
              )}
              {searchResults.map((b) => (
                <div key={b.id} className="search-item">
                  <div className="search-info">
                    <strong className="text-primary">{b.title}</strong> 
                    <span className="text-secondary"> by {b.author}</span>
                  </div>
                  <Button size="sm" onClick={() => handleAddBook(b)}>Add to Library</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isLoading && <div className="skeleton" style={{ height: '200px' }} />}
      
      {!isLoading && userBooks.length === 0 && (
        <div className="empty-state glass">
          <div className="empty-state-icon">📚</div>
          <h2 className="empty-state-title">Your library is empty</h2>
          <p className="empty-state-desc">Search for a book to start tracking your reading journey.</p>
        </div>
      )}

      <div className="library-grid">
        {userBooks.map((ub) => (
          <div key={ub.id} className="book-card glass">
            {ub.book?.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ub.book.cover_url} alt={ub.book.title} className="book-cover" />
            ) : (
              <div className="book-cover flex-center" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                 No Cover
              </div>
            )}
            <div className="book-info">
              <h3 className="book-title">{ub.book?.title}</h3>
              <p className="book-author">{ub.book?.author}</p>
              
              <div className="progress-section">
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${ub.progress_percent}%` }}></div>
                </div>
                <div className="flex-between" style={{ marginTop: 'var(--sp-2)' }}>
                  <span className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>
                    P. {ub.current_page} / {ub.book?.total_pages || '?'}
                  </span>
                  <span className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>
                    {ub.progress_percent.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="book-actions">
                {ub.book?.file_url ? (
                   <Button size="sm" fullWidth onClick={() => window.location.href = `/reader/${ub.id}`}>Read Now</Button>
                ) : (
                   <Button size="sm" fullWidth variant="secondary" onClick={() => alert("This book was imported via Google. Upload an EPUB to read in-app.")}>Physical Copy</Button>
                )}
                <Button size="sm" variant="danger" onClick={async () => {
                     try {
                         await removeBook(ub.id);
                     } catch(e:any) {
                         setAddError("Delete Error: " + e.message);
                     }
                }}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .books-page {
          padding: var(--sp-8) var(--sp-6);
          max-width: var(--max-content-width);
          margin: 0 auto;
        }

        .page-title {
          font-size: var(--fs-2xl);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--sp-8);
        }

        .search-section {
          padding: var(--sp-6);
          margin-bottom: var(--sp-8);
          border-radius: var(--radius-xl);
          background: var(--surface-glass);
        }

        .search-status {
            margin-top: var(--sp-4);
            font-size: var(--fs-sm);
        }

        .search-results {
          margin-top: var(--sp-4);
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
          max-height: 300px;
          overflow-y: auto;
          padding-right: var(--sp-2);
        }

        .search-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--sp-3);
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .library-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--sp-6);
        }

        .book-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform var(--duration-normal);
        }

        .book-card:hover {
            transform: translateY(-4px);
            border-color: var(--accent-primary);
        }

        .book-cover {
          width: 100%;
          height: 240px;
          object-fit: cover;
          border-bottom: 1px solid var(--border-subtle);
        }

        .book-info {
          padding: var(--sp-5);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .book-title {
          font-size: var(--fs-lg);
          font-weight: var(--fw-bold);
          margin-bottom: var(--sp-1);
          color: var(--text-primary);
        }

        .book-author {
          font-size: var(--fs-sm);
          color: var(--text-secondary);
          margin-bottom: var(--sp-4);
        }

        .progress-section {
          margin-top: auto;
          margin-bottom: var(--sp-4);
        }

        .book-actions {
          display: flex;
          gap: var(--sp-2);
        }
      `}</style>
    </div>
  );
}
