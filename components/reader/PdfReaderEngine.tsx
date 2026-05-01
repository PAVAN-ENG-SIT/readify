"use client";
import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';

interface PdfReaderEngineProps {
  fileUrl: string;
  onPageChange?: (page: number) => void;
}

export default function PdfReaderEngine({ fileUrl, onPageChange }: PdfReaderEngineProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  useEffect(() => {
    const { pdfjs } = require('react-pdf');
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    const updateWidth = () => setContainerWidth(Math.min(window.innerWidth * 0.9, 800));
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => {
      const next = prevPageNumber + offset;
      if (onPageChange) onPageChange(next);
      return next;
    });
  }

  return (
    <div className="pdf-reader-engine">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div style={{ padding: '2rem', color: '#666' }}>Loading PDF Engine...</div>}
        error={<div style={{ padding: '2rem', color: '#ff6b6b' }}>Failed to load PDF. Please make sure the file URL is valid.</div>}
        className="pdf-document"
      >
         {!isLoading && (
            <Page 
              pageNumber={pageNumber} 
              className="pdf-page"
              renderTextLayer={true}
              renderAnnotationLayer={true}
              width={containerWidth}
            />
         )}
      </Document>
      
      {!isLoading && (
        <div className="pdf-controls">
          <button 
             disabled={pageNumber <= 1} 
             onClick={() => changePage(-1)}
             className="control-btn"
          >
             ← Prev
          </button>
          
          <span className="page-indicator">
            Page {pageNumber} of {numPages}
          </span>
          
          <button 
             disabled={pageNumber >= numPages} 
             onClick={() => changePage(1)}
             className="control-btn"
          >
             Next →
          </button>
        </div>
      )}

      <style jsx global>{`
        .pdf-reader-engine {
           display: flex;
           flex-direction: column;
           align-items: center;
           background: var(--surface-raised);
           height: 100%;
           width: 100%;
           position: relative;
           overflow-y: auto;
           padding: var(--sp-6) 0 var(--sp-20) 0;
        }
        .pdf-document {
           display: flex;
           justify-content: center;
           box-shadow: var(--shadow-lg);
           background: white; /* PDF pages should have white background */
           border-radius: var(--radius-sm);
           overflow: hidden;
        }
        .pdf-controls {
           position: fixed;
           bottom: var(--sp-6);
           left: 50%;
           transform: translateX(-50%);
           display: flex;
           align-items: center;
           gap: var(--sp-4);
           background: rgba(0,0,0,0.85);
           padding: var(--sp-2) var(--sp-5);
           border-radius: 30px;
           z-index: 50;
           backdrop-filter: blur(10px);
           white-space: nowrap;
        }
        .control-btn {
           background: transparent;
           color: white;
           border: 1px solid rgba(255,255,255,0.2);
           padding: var(--sp-2) var(--sp-4);
           border-radius: 20px;
           cursor: pointer;
           font-size: var(--fs-sm);
           transition: background 0.2s;
        }
        .control-btn:hover:not(:disabled) {
           background: rgba(255,255,255,0.1);
        }
        .control-btn:disabled {
           opacity: 0.4;
           cursor: not-allowed;
        }
        .page-indicator {
           color: white;
           font-size: var(--fs-sm);
           font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}
