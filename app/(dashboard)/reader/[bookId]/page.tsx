'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookStore } from '@/store/useBookStore';
import Button from '@/components/ui/Button';
import { ReactReader } from 'react-reader';

export default function ReaderPage({ params }: { params: { bookId: string } }) {
  const router = useRouter();
  const { userBooks, fetchBooks } = useBookStore();
  
  const [location, setLocation] = useState<string | number>(0);

  const userBook = userBooks.find((ub) => ub.id === params.bookId);
  const isPdf = userBook?.book?.file_url?.toLowerCase().includes('.pdf');

  useEffect(() => {
    if (userBooks.length === 0) fetchBooks();
  }, [userBooks, fetchBooks]);

  if (!userBook) return <div className="p-8">Loading library...</div>;
  if (!userBook.book?.file_url) return (
      <div className="p-8 mt-8 glass text-center">
          <h2>No File found</h2>
          <p className="text-secondary mt-2">This book was not uploaded as a digital file.</p>
          <Button onClick={() => router.push('/books')} className="mt-4">Go Back</Button>
      </div>
  );

  return (
    <div className="reader-container animate-fade-in">
      <div className="reader-header glass">
         <h2 style={{fontSize: 'var(--fs-lg)'}}>{userBook.book.title}</h2>
         <div className="reader-controls" style={{display: 'flex', gap: 'var(--sp-2)'}}>
            <Button size="sm" variant="secondary" onClick={() => router.push('/books')}>Back to Library</Button>
         </div>
      </div>
      
      <div className="reader-body">
         {isPdf ? (
             <iframe 
                 src={userBook.book.file_url} 
                 className="pdf-viewer" 
                 title="PDF Viewer"
             />
         ) : (
             <div className="epub-professional-wrapper">
                 <ReactReader
                     url={userBook.book.file_url}
                     location={location}
                     locationChanged={(epubcfi: string) => setLocation(epubcfi)}
                     epubInitOptions={{
                         openAs: 'epub'
                     }}
                     getRendition={(rendition) => {
                         rendition.themes.default({
                             'p': { 'margin-bottom': '1.5em !important', 'line-height': '1.8 !important', 'font-family': 'Inter, system-ui, sans-serif !important' },
                             'div': { 'line-height': '1.6 !important', 'font-family': 'Inter, system-ui, sans-serif !important' },
                             'h1, h2, h3': { 'margin-top': '2em !important', 'margin-bottom': '1em !important', 'font-family': 'Inter, system-ui, sans-serif !important' }
                         });
                     }}
                 />
             </div>
         )}
      </div>

      <style jsx>{`
        .reader-container {
           display: flex;
           flex-direction: column;
           height: 100%;
           min-height: calc(100vh - 40px);
           background: var(--surface-base);
           border-radius: var(--radius-xl);
           overflow: hidden;
           border: 1px solid var(--border-subtle);
        }
        .reader-header {
           padding: var(--sp-4) var(--sp-6);
           border-bottom: 1px solid var(--border-subtle);
           display: flex;
           justify-content: space-between;
           align-items: center;
           z-index: 10;
        }
        .reader-body {
           flex: 1;
           display: flex;
           align-items: stretch;
           position: relative;
        }
        .epub-professional-wrapper {
           flex: 1;
           position: relative;
           background: #ffffff;
           color: #000;
        }
        .pdf-viewer {
           position: absolute;
           inset: 0;
           width: 100%;
           height: 100%;
           border: none;
           background: #fff;
        }
      `}</style>
    </div>
  );
}
