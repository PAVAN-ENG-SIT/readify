'use client';
import { useEffect, useState } from 'react';

export default function StreaksPage() {
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
      fetch('/api/streaks').then(r=>r.json()).then(d=>setData(d));
  }, []);
  
  return (
    <div className="streaks-page animate-fade-in">
      <div className="header">
        <h1 className="page-title">Reading Streaks</h1>
        <p className="text-secondary">Keep the flame alive by reading every day.</p>
      </div>

      <div className="streaks-container">
          {/* Main Streak Display */}
          <div className="streak-hero glass">
              {data?.streak ? (
                  <>
                      <div className="flame-icon">🔥</div>
                      <h2 className="streak-count">{data.streak.current_streak} Days</h2>
                      <div className="streak-stats">
                          <div className="stat-box">
                              <span className="stat-label">Longest Streak</span>
                              <span className="stat-value">{data.streak.longest_streak}</span>
                          </div>
                      </div>
                  </>
              ) : (
                  <>
                      <div className="flame-icon frozen">🧊</div>
                      <h2 className="streak-count empty">No active streak</h2>
                      <p className="text-secondary" style={{marginTop: 'var(--sp-2)'}}>Read a book today to start your first streak!</p>
                  </>
              )}
          </div>

          {/* Activity Log */}
          <div className="streak-history">
              <h3 className="history-title">Recent Activity Log</h3>
              <div className="history-list">
                  {data?.logs?.map((l: any) => (
                      <div key={l.id} className="history-item glass">
                          <span className="history-date">
                             {new Date(l.activity_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="history-pages">
                              <strong className="text-primary">{l.pages_read}</strong> pages
                          </span>
                      </div>
                  ))}
                  {data?.logs?.length === 0 && (
                      <div className="history-item glass" style={{justifyContent: 'center'}}>
                          <p className="text-muted">No activity logged yet.</p>
                      </div>
                  )}
              </div>
          </div>
      </div>

      <style jsx>{`
        .streaks-page {
           padding: var(--sp-8) var(--sp-6);
           max-width: 1000px;
           margin: 0 auto;
        }
        .header {
           margin-bottom: var(--sp-8);
        }
        .page-title {
           font-size: var(--fs-2xl);
           margin-bottom: var(--sp-2);
        }
        .streaks-container {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: var(--sp-8);
           align-items: start;
        }
        @media (max-width: 768px) {
           .streaks-container {
               grid-template-columns: 1fr;
           }
        }
        .streak-hero {
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;
           padding: var(--sp-12) var(--sp-8);
           border-radius: var(--radius-2xl);
           text-align: center;
           position: sticky;
           top: var(--sp-8);
        }
        .flame-icon {
           font-size: 7rem;
           line-height: 1;
           filter: drop-shadow(0 0 30px rgba(255, 107, 107, 0.6));
           margin-bottom: var(--sp-4);
        }
        .flame-icon.frozen {
           filter: opacity(0.5);
        }
        .streak-count {
           font-size: 4.5rem;
           color: var(--accent-primary);
           text-shadow: 0 0 20px var(--accent-primary-glow);
           margin-bottom: var(--sp-6);
           line-height: 1.1;
        }
        .streak-count.empty {
           font-size: 2.5rem;
           color: var(--text-primary);
           text-shadow: none;
        }
        .streak-stats {
           display: flex;
           gap: var(--sp-4);
           width: 100%;
           justify-content: center;
           border-top: 1px solid var(--border-subtle);
           padding-top: var(--sp-6);
        }
        .stat-box {
           display: flex;
           flex-direction: column;
           align-items: center;
        }
        .stat-label {
           font-size: var(--fs-sm);
           color: var(--text-secondary);
           text-transform: uppercase;
           letter-spacing: 0.05em;
           margin-bottom: var(--sp-1);
        }
        .stat-value {
           font-size: var(--fs-xl);
           font-weight: var(--fw-bold);
           color: var(--text-primary);
        }
        .streak-history {
           display: flex;
           flex-direction: column;
        }
        .history-title {
           font-size: var(--fs-lg);
           margin-bottom: var(--sp-4);
           padding-bottom: var(--sp-2);
           border-bottom: 2px solid var(--border-subtle);
        }
        .history-list {
           display: flex;
           flex-direction: column;
           gap: var(--sp-3);
           max-height: calc(100vh - 200px);
           overflow-y: auto;
           padding-right: var(--sp-2);
        }
        .history-item {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: var(--sp-4) var(--sp-5);
           border-radius: var(--radius-lg);
           transition: transform var(--duration-fast);
        }
        .history-item:hover {
           transform: translateX(4px);
           border-color: var(--border-muted);
        }
        .history-date {
           font-family: var(--font-mono);
           font-size: var(--fs-sm);
           color: var(--text-secondary);
        }
        .history-pages {
           font-size: var(--fs-md);
        }
      `}</style>
    </div>
  );
}
