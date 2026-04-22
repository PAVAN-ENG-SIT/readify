'use client';

// ═══════════════════════════════════════════════════════════
// Readify — Auth Layout
// Centered card with gradient background
// ═══════════════════════════════════════════════════════════

import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="auth-layout">
        <div className="auth-glow" />
        <div className="auth-container">
          <Link href="/" className="auth-brand">
            <span className="auth-logo">📖</span>
            <span className="auth-name">Readify</span>
          </Link>
          <div className="auth-card">
            {children}
          </div>
          <p className="auth-footer">
            Your reading journey starts here.
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-hero);
          padding: var(--sp-6);
          position: relative;
          overflow: hidden;
        }

        .auth-glow {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--accent-primary-glow) 0%, transparent 70%);
          filter: blur(100px);
          pointer-events: none;
          opacity: 0.5;
        }

        .auth-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--sp-8);
          animation: fadeInUp var(--duration-slow) var(--ease-out);
        }

        .auth-brand {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          text-decoration: none;
        }

        .auth-logo {
          font-size: 2rem;
        }

        .auth-name {
          font-family: var(--font-display);
          font-size: var(--fs-2xl);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
        }

        .auth-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-2xl);
          padding: var(--sp-8);
          box-shadow: var(--shadow-xl);
        }

        .auth-footer {
          font-size: var(--fs-sm);
          color: var(--text-muted);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
