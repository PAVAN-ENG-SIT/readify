'use client';
import { useEffect, useState } from 'react';
import ReadingHeatmap from "@/components/ReadingHeatmap";

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
          
          {/* SECTION 1: HERO */}
          <section className="dashboard-section">
            <div className="streak-hero glass premium-glow">
                <div className="flame-icon">🔥</div>
                <div className="hero-stats">
                    <h2 className="streak-count">{data?.streak?.current_streak || 14} <span className="days-label">Days</span></h2>
                    <div className="streak-stats">
                        <div className="stat-box">
                            <span className="stat-label">Longest Streak</span>
                            <span className="stat-value">{data?.streak?.longest_streak || 32}</span>
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {/* SECTION 2: HEATMAP */}
          <section className="dashboard-section">
              <div className="glass heatmap-wrapper">
                  <ReadingHeatmap />
              </div>
          </section>

          {/* SECTION 3: ACTIVITY LOGS */}
          <section className="dashboard-section">
              <div className="streak-history glass">
                  <div className="history-header">
                      <h3 className="history-title">Recent Activity</h3>
                      <span className="history-badge">{data?.logs?.length || 0} Sessions</span>
                  </div>
                  
                  <div className="history-grid">
                      {data?.logs?.map((l: any) => (
                          <div key={l.id} className="history-item">
                              <div className="history-icon">📖</div>
                              <div className="history-details">
                                  <span className="history-date">
                                    {new Date(l.activity_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                  </span>
                                  <span className="history-pages">
                                      <strong className="text-primary">{l.pages_read}</strong> pages read
                                  </span>
                              </div>
                          </div>
                      ))}
                      {(!data?.logs || data.logs.length === 0) && (
                          <div className="empty-state">
                              <div className="empty-icon">☕</div>
                              <p className="text-muted">No activity logged recently. Grab a book and start reading!</p>
                          </div>
                      )}
                  </div>
              </div>
          </section>

      </div>

      <style jsx>{`
        .streaks-page {
           padding: var(--sp-8) var(--sp-6);
           max-width: 1000px;
           margin: 0 auto;
        }
        .header {
           margin-bottom: var(--sp-8);
           text-align: center;
        }
        .page-title {
           font-size: var(--fs-3xl);
           font-weight: 800;
           letter-spacing: -0.02em;
           margin-bottom: var(--sp-2);
           background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
        }
        .streaks-container {
           display: flex;
           flex-direction: column;
           gap: var(--sp-8);
        }
        .dashboard-section {
           width: 100%;
           animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
           opacity: 0;
           transform: translateY(20px);
        }
        .dashboard-section:nth-child(1) { animation-delay: 0.1s; }
        .dashboard-section:nth-child(2) { animation-delay: 0.2s; }
        .dashboard-section:nth-child(3) { animation-delay: 0.3s; }

        @keyframes slideUp {
           to { opacity: 1; transform: translateY(0); }
        }

        /* Hero Styles */
        .streak-hero {
           display: flex;
           flex-direction: row;
           align-items: center;
           justify-content: center;
           gap: var(--sp-12);
           padding: var(--sp-10) var(--sp-8);
           border-radius: var(--radius-2xl);
           position: relative;
           overflow: hidden;
        }
        .premium-glow::before {
           content: '';
           position: absolute;
           top: -50%; right: -50%; bottom: -50%; left: -50%;
           background: radial-gradient(circle at center, rgba(255, 107, 107, 0.08) 0%, transparent 50%);
           z-index: 0;
           pointer-events: none;
        }
        .flame-icon {
           font-size: 8rem;
           line-height: 1;
           filter: drop-shadow(0 10px 40px rgba(255, 107, 107, 0.4));
           z-index: 1;
           animation: pulseFlame 3s ease-in-out infinite;
        }
        @keyframes pulseFlame {
           0%, 100% { transform: scale(1) rotate(-2deg); }
           50% { transform: scale(1.05) rotate(2deg); filter: drop-shadow(0 15px 50px rgba(255, 107, 107, 0.6)); }
        }
        .hero-stats {
           display: flex;
           flex-direction: column;
           align-items: flex-start;
           z-index: 1;
        }
        .streak-count {
           font-size: 5rem;
           font-weight: 900;
           line-height: 1;
           color: var(--accent-primary);
           text-shadow: 0 0 30px var(--accent-primary-glow);
           margin-bottom: var(--sp-4);
           display: flex;
           align-items: baseline;
           gap: var(--sp-2);
        }
        .days-label {
           font-size: 2rem;
           font-weight: 600;
           color: var(--text-primary);
           text-shadow: none;
        }
        .streak-stats {
           display: flex;
           background: rgba(0,0,0,0.2);
           padding: var(--sp-3) var(--sp-6);
           border-radius: var(--radius-full);
           border: 1px solid var(--border-subtle);
        }
        .stat-box {
           display: flex;
           align-items: center;
           gap: var(--sp-3);
        }
        .stat-label {
           font-size: var(--fs-xs);
           color: var(--text-secondary);
           text-transform: uppercase;
           letter-spacing: 0.1em;
           font-weight: 600;
        }
        .stat-value {
           font-size: var(--fs-lg);
           font-weight: var(--fw-bold);
           color: var(--text-primary);
        }

        @media (max-width: 640px) {
           .streak-hero {
              flex-direction: column;
              text-align: center;
              gap: var(--sp-6);
           }
           .hero-stats {
              align-items: center;
           }
           .streak-count {
              font-size: 4rem;
           }
        }

        /* Heatmap Styles */
        .heatmap-wrapper {
           border-radius: var(--radius-2xl);
           padding: var(--sp-4) 0;
           overflow: hidden;
        }

        /* History Logs Styles */
        .streak-history {
           padding: var(--sp-8);
           border-radius: var(--radius-2xl);
        }
        .history-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: var(--sp-6);
           padding-bottom: var(--sp-4);
           border-bottom: 1px solid var(--border-subtle);
        }
        .history-title {
           font-size: var(--fs-xl);
           font-weight: 700;
        }
        .history-badge {
           background: var(--surface-raised);
           padding: var(--sp-1) var(--sp-3);
           border-radius: var(--radius-full);
           font-size: var(--fs-xs);
           font-weight: 600;
           color: var(--text-secondary);
           border: 1px solid var(--border-subtle);
        }
        .history-grid {
           display: grid;
           grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
           gap: var(--sp-4);
        }
        .history-item {
           display: flex;
           align-items: center;
           gap: var(--sp-4);
           background: var(--surface-base);
           padding: var(--sp-4);
           border-radius: var(--radius-xl);
           border: 1px solid var(--border-subtle);
           transition: all 0.2s ease;
        }
        .history-item:hover {
           transform: translateY(-2px);
           border-color: var(--border-muted);
           box-shadow: var(--shadow-sm);
        }
        .history-icon {
           font-size: 1.5rem;
           background: var(--surface-raised);
           width: 48px;
           height: 48px;
           display: flex;
           align-items: center;
           justify-content: center;
           border-radius: var(--radius-lg);
        }
        .history-details {
           display: flex;
           flex-direction: column;
           gap: var(--sp-1);
        }
        .history-date {
           font-size: var(--fs-sm);
           color: var(--text-secondary);
           font-weight: 500;
        }
        .history-pages {
           font-size: var(--fs-md);
           color: var(--text-primary);
        }
        .empty-state {
           grid-column: 1 / -1;
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;
           padding: var(--sp-10) 0;
           text-align: center;
           background: var(--surface-base);
           border-radius: var(--radius-xl);
           border: 1px dashed var(--border-muted);
        }
        .empty-icon {
           font-size: 2.5rem;
           margin-bottom: var(--sp-3);
           opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
