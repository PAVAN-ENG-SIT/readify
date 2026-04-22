'use client';

import Link from 'next/link';

// ═══════════════════════════════════════════════════════════
// Readify — Landing Page
// Premium hero section with features grid and CTA
// ═══════════════════════════════════════════════════════════

export default function LandingPage() {
    return (
        <>
            <div className="landing">
                {/* ── Navigation ── */}
                <nav className="nav">
                    <div className="nav-inner">
                        <div className="nav-brand">
                            <span className="nav-logo">📖</span>
                            <span className="nav-name">Readify</span>
                        </div>
                        <div className="nav-links">
                            <Link href="/login" className="nav-link">Log in</Link>
                            <Link href="/signup" className="nav-cta">Get Started</Link>
                        </div>
                    </div>
                </nav>

                {/* ── Hero ── */}
                <section className="hero">
                    <div className="hero-glow" />
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="hero-badge-dot" />
                            Reading OS for the obsessed
                        </div>
                        <h1 className="hero-title">
                            Build <span className="text-gradient">Unbreakable</span><br />
                            Reading Habits
                        </h1>
                        <p className="hero-desc">
                            Track per-book progress, maintain streaks, sign reading contracts,
                            and get AI-powered summaries so you never lose context — even after weeks away.
                        </p>
                        <div className="hero-actions">
                            <Link href="/signup" className="hero-btn-primary">
                                Start Reading Journey
                                <span className="hero-btn-arrow">→</span>
                            </Link>
                            <Link href="/login" className="hero-btn-secondary">
                                I have an account
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="hero-stat-value">∞</span>
                                <span className="hero-stat-label">Books Tracked</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="hero-stat-value">🔥</span>
                                <span className="hero-stat-label">Per-Book Streaks</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="hero-stat-value">🧠</span>
                                <span className="hero-stat-label">AI Re-entry</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Features ── */}
                <section className="features" id="features">
                    <div className="features-inner">
                        <h2 className="section-title">
                            Everything you need to <span className="text-gradient">read consistently</span>
                        </h2>
                        <p className="section-desc">
                            Not another reading list app. Readify is engineered for deep engagement per book.
                        </p>

                        <div className="features-grid">
                            <div className="feature-card feature-card-1">
                                <div className="feature-icon">📊</div>
                                <h3 className="feature-title">Per-Book Progress</h3>
                                <p className="feature-desc">
                                    Track pages, chapters, and time spent per book. Not global — per book. Because every book deserves focus.
                                </p>
                            </div>

                            <div className="feature-card feature-card-2">
                                <div className="feature-icon">🔥</div>
                                <h3 className="feature-title">Smart Streaks</h3>
                                <p className="feature-desc">
                                    Book-specific streak system. Meeting your daily contract keeps the fire burning. Timezone-safe, no false breaks.
                                </p>
                            </div>

                            <div className="feature-card feature-card-3">
                                <div className="feature-icon">📝</div>
                                <h3 className="feature-title">Reading Contracts</h3>
                                <p className="feature-desc">
                                    Set a daily page or time goal. Soft mode uses weekly averages — read 50 one day, rest the next. Flexible accountability.
                                </p>
                            </div>

                            <div className="feature-card feature-card-4">
                                <div className="feature-icon">🧠</div>
                                <h3 className="feature-title">AI Re-entry</h3>
                                <p className="feature-desc">
                                    Return after weeks? Get an AI-powered &quot;what happened so far&quot; summary. Never re-read chapters just to remember context.
                                </p>
                            </div>

                            <div className="feature-card feature-card-5">
                                <div className="feature-icon">⏱️</div>
                                <h3 className="feature-title">Session Tracking</h3>
                                <p className="feature-desc">
                                    Live reading sessions with heartbeat monitoring, idle detection, and crash recovery. Every minute counted accurately.
                                </p>
                            </div>

                            <div className="feature-card feature-card-6">
                                <div className="feature-icon">🏆</div>
                                <h3 className="feature-title">Completion Rewards</h3>
                                <p className="feature-desc">
                                    Finish a book? Earn badges, view your complete reading journey, and archive it to your completed library.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="cta-section">
                    <div className="cta-card">
                        <div className="cta-glow" />
                        <h2 className="cta-title">Ready to read with purpose?</h2>
                        <p className="cta-desc">
                            Join Readify and transform scattered reading into a structured, rewarding habit.
                        </p>
                        <Link href="/signup" className="cta-btn">
                            Create Free Account
                            <span className="hero-btn-arrow">→</span>
                        </Link>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="footer">
                    <div className="footer-inner">
                        <div className="footer-brand">
                            <span className="nav-logo">📖</span>
                            <span className="nav-name">Readify</span>
                        </div>
                        <p className="footer-copy">© 2026 Readify. Read. Track. Repeat.</p>
                    </div>
                </footer>
            </div>

            <style jsx>{`
        .landing {
          min-height: 100vh;
        }

        /* ── Nav ── */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--z-sticky);
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
        }

        .nav-inner {
          max-width: var(--max-content-width);
          margin: 0 auto;
          padding: var(--sp-4) var(--sp-6);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
        }

        .nav-logo {
          font-size: 1.5rem;
        }

        .nav-name {
          font-family: var(--font-display);
          font-size: var(--fs-lg);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: var(--sp-4);
        }

        .nav-link {
          color: var(--text-secondary);
          font-size: var(--fs-sm);
          font-weight: var(--fw-medium);
          transition: color var(--duration-fast);
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-cta {
          padding: var(--sp-2) var(--sp-5);
          background: var(--gradient-primary);
          color: white;
          font-size: var(--fs-sm);
          font-weight: var(--fw-semibold);
          border-radius: var(--radius-md);
          transition: all var(--duration-normal) var(--ease-out);
        }

        .nav-cta:hover {
          box-shadow: 0 4px 20px var(--accent-primary-glow);
          transform: translateY(-1px);
          color: white;
        }

        /* ── Hero ── */
        .hero {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: var(--sp-20) var(--sp-6) var(--sp-16);
          text-align: center;
          overflow: hidden;
          background: var(--gradient-hero);
        }

        .hero-glow {
          position: absolute;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--accent-primary-glow) 0%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
          animation: glowPulse 4s ease-in-out infinite;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-2) var(--sp-4);
          background: var(--surface-glass);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: var(--fs-sm);
          color: var(--text-secondary);
          margin-bottom: var(--sp-8);
          animation: fadeInDown var(--duration-slow) var(--ease-out);
        }

        .hero-badge-dot {
          width: 8px;
          height: 8px;
          background: var(--accent-green);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .hero-title {
          font-size: var(--fs-5xl);
          font-weight: var(--fw-extrabold);
          line-height: var(--lh-tight);
          margin-bottom: var(--sp-6);
          animation: fadeInUp var(--duration-slow) var(--ease-out) 100ms backwards;
        }

        .hero-desc {
          font-size: var(--fs-lg);
          color: var(--text-secondary);
          line-height: var(--lh-relaxed);
          max-width: 600px;
          margin: 0 auto var(--sp-10);
          animation: fadeInUp var(--duration-slow) var(--ease-out) 200ms backwards;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--sp-4);
          margin-bottom: var(--sp-16);
          animation: fadeInUp var(--duration-slow) var(--ease-out) 300ms backwards;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-4) var(--sp-8);
          background: var(--gradient-primary);
          color: white;
          font-size: var(--fs-md);
          font-weight: var(--fw-semibold);
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 24px var(--accent-primary-glow);
          transition: all var(--duration-normal) var(--ease-out);
        }

        .hero-btn-primary:hover {
          box-shadow: 0 8px 40px var(--accent-primary-glow);
          transform: translateY(-2px);
          color: white;
        }

        .hero-btn-arrow {
          transition: transform var(--duration-fast) var(--ease-out);
        }

        .hero-btn-primary:hover .hero-btn-arrow {
          transform: translateX(4px);
        }

        .hero-btn-secondary {
          padding: var(--sp-4) var(--sp-8);
          color: var(--text-secondary);
          font-size: var(--fs-md);
          font-weight: var(--fw-medium);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-medium);
          transition: all var(--duration-normal) var(--ease-out);
        }

        .hero-btn-secondary:hover {
          border-color: var(--border-strong);
          color: var(--text-primary);
          background: var(--surface-glass);
        }

        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--sp-8);
          animation: fadeInUp var(--duration-slow) var(--ease-out) 400ms backwards;
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--sp-1);
        }

        .hero-stat-value {
          font-size: var(--fs-2xl);
          font-weight: var(--fw-bold);
          font-family: var(--font-display);
        }

        .hero-stat-label {
          font-size: var(--fs-xs);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .hero-stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-subtle);
        }

        /* ── Features ── */
        .features {
          padding: var(--sp-24) var(--sp-6);
          background: var(--bg-secondary);
        }

        .features-inner {
          max-width: var(--max-content-width);
          margin: 0 auto;
          text-align: center;
        }

        .section-title {
          font-size: var(--fs-3xl);
          font-weight: var(--fw-bold);
          margin-bottom: var(--sp-4);
        }

        .section-desc {
          font-size: var(--fs-lg);
          color: var(--text-tertiary);
          margin-bottom: var(--sp-16);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--sp-6);
          text-align: left;
        }

        .feature-card {
          background: var(--gradient-card);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: var(--sp-8);
          transition: all var(--duration-normal) var(--ease-out);
        }

        .feature-card:hover {
          border-color: var(--border-medium);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: var(--sp-4);
        }

        .feature-title {
          font-size: var(--fs-lg);
          font-weight: var(--fw-semibold);
          margin-bottom: var(--sp-3);
          color: var(--text-primary);
        }

        .feature-desc {
          font-size: var(--fs-sm);
          color: var(--text-secondary);
          line-height: var(--lh-relaxed);
        }

        /* ── CTA ── */
        .cta-section {
          padding: var(--sp-24) var(--sp-6);
          display: flex;
          justify-content: center;
        }

        .cta-card {
          position: relative;
          max-width: 700px;
          width: 100%;
          text-align: center;
          padding: var(--sp-16) var(--sp-8);
          background: var(--gradient-card);
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-2xl);
          overflow: hidden;
        }

        .cta-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, var(--accent-primary-glow) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }

        .cta-title {
          position: relative;
          font-size: var(--fs-3xl);
          font-weight: var(--fw-bold);
          margin-bottom: var(--sp-4);
        }

        .cta-desc {
          position: relative;
          font-size: var(--fs-md);
          color: var(--text-secondary);
          margin-bottom: var(--sp-8);
        }

        .cta-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-4) var(--sp-10);
          background: var(--gradient-primary);
          color: white;
          font-size: var(--fs-md);
          font-weight: var(--fw-semibold);
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 24px var(--accent-primary-glow);
          transition: all var(--duration-normal) var(--ease-out);
        }

        .cta-btn:hover {
          box-shadow: 0 8px 40px var(--accent-primary-glow);
          transform: translateY(-2px);
          color: white;
        }

        /* ── Footer ── */
        .footer {
          border-top: 1px solid var(--border-subtle);
          padding: var(--sp-8) var(--sp-6);
        }

        .footer-inner {
          max-width: var(--max-content-width);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
        }

        .footer-copy {
          font-size: var(--fs-sm);
          color: var(--text-muted);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
          }

          .hero-actions {
            flex-direction: column;
          }

          .hero-stats {
            flex-direction: column;
            gap: var(--sp-4);
          }

          .hero-stat-divider {
            width: 40px;
            height: 1px;
          }

          .footer-inner {
            flex-direction: column;
            gap: var(--sp-4);
            text-align: center;
          }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
        </>
    );
}
