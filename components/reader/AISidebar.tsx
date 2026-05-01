import React, { useState, useEffect } from 'react';
import { extractPdfPages } from '@/lib/reading/pdfExtractor';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  currentPage: number;
}

export default function AISidebar({ isOpen, onClose, fileUrl, currentPage }: Props) {
  const [startPage, setStartPage] = useState<number>(currentPage);
  const [endPage, setEndPage] = useState<number>(currentPage);
  const [summary, setSummary] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);

  // Sync inputs with current page when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setStartPage(currentPage);
      setEndPage(currentPage);
    }
  }, [isOpen, currentPage]);

    const handleSummarize = async () => {
    setIsExtracting(true);
    setSummary('');
    try {
      // 1. Extract PDF Text
      const extractedText = await extractPdfPages(fileUrl, startPage, endPage);
      
      // 2. Fetch Gemini Summary
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText, startPage, endPage })
      });
      
      if (res.status === 503) {
          throw new Error('⚠ AI is busy right now. Try again in a few seconds.');
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch summary');
      
      setSummary(data.summary);
    } catch (err: any) {
      console.error(err);
      setSummary(err.message.includes('AI is busy') 
        ? err.message 
        : `Error: ${err.message}`);
    } finally {
      setIsExtracting(false);
    }
  };


  return (
     <div className={`ai-sidebar ${isOpen ? 'open' : ''}`}>
       <div className="sidebar-header">
           <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>✨ Gemini Assistant</h3>
           <button onClick={onClose} className="close-btn">×</button>
       </div>
       
       <div className="sidebar-body">
           <div className="input-group">
               <label>Start Page</label>
               <input type="number" min="1" value={startPage} onChange={(e) => setStartPage(Number(e.target.value))} />
           </div>
           <div className="input-group">
               <label>End Page</label>
               <input type="number" min="1" value={endPage} onChange={(e) => setEndPage(Number(e.target.value))} />
           </div>
           
           <button className="summarize-btn" onClick={handleSummarize} disabled={isExtracting}>
               {isExtracting ? 'AI is reading...' : 'Summarize Range'}
           </button>
           
           {summary && (
              <div className="summary-result">
                  {summary.split('\n').map((line, i) => {
                      if (line.startsWith('*') || line.startsWith('-')) {
                         return <li key={i} style={{ marginLeft: '1rem', marginBottom: '0.2rem' }}>{line.replace(/^[-*]\s*/, '')}</li>;
                      }
                      if (line.includes('**')) {
                         const parts = line.split('**');
                         return (
                            <p key={i} style={{ marginBottom: '0.5em', marginTop: '0.5em' }}>
                               {parts.map((part, index) => index % 2 === 1 ? <strong key={index}>{part}</strong> : part)}
                            </p>
                         );
                      }
                      return <p key={i} style={{ marginBottom: '0.5em' }}>{line}</p>;
                  })}
              </div>
           )}
       </div>

       <style jsx>{`
         .ai-sidebar {
            position: fixed;
            top: 0;
            right: -450px;
            width: 400px;
            height: 100vh;
            background: var(--surface-raised);
            border-left: 1px solid var(--border-subtle);
            box-shadow: -10px 0 30px rgba(0,0,0,0.2);
            transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            color: var(--text-primary);
         }
         .ai-sidebar.open {
            right: 0;
         }
         .sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--sp-6);
            border-bottom: 1px solid var(--border-subtle);
         }
         .close-btn {
            background: none;
            border: none;
            font-size: 28px;
            line-height: 1;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0;
         }
         .close-btn:hover {
            color: var(--text-primary);
         }
         .sidebar-body {
            padding: var(--sp-6);
            flex: 1;
            overflow-y: auto;
         }
         .input-group {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--sp-4);
         }
         input {
            width: 100px;
            padding: var(--sp-2) var(--sp-3);
            border-radius: var(--radius-md);
            border: 1px solid var(--border-subtle);
            background: var(--surface-base);
            color: var(--text-primary);
            font-size: var(--fs-md);
         }
         .summarize-btn {
            width: 100%;
            padding: var(--sp-3);
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            color: white;
            border: none;
            border-radius: var(--radius-lg);
            font-weight: bold;
            font-size: var(--fs-md);
            cursor: pointer;
            margin-top: var(--sp-2);
            margin-bottom: var(--sp-8);
            transition: opacity 0.2s;
         }
         .summarize-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
         }
         .summary-result {
            background: var(--surface-base);
            padding: var(--sp-5);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-subtle);
            font-size: var(--fs-sm);
            line-height: 1.6;
         }
       `}</style>
     </div>
  );
}
