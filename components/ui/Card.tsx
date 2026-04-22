'use client';

import React from 'react';

// ═══════════════════════════════════════════════════════════
// READIFY — Card Component (Glassmorphic)
// ═══════════════════════════════════════════════════════════

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glow' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
}: CardProps) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <>
      <Tag
        className={`card card-${variant} card-pad-${padding} ${className}`}
        onClick={onClick}
        type={onClick ? 'button' : undefined}
      >
        {children}
      </Tag>

      <style jsx>{`
        .card {
          background: var(--gradient-card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          transition: all var(--duration-normal) var(--ease-out);
          width: 100%;
          text-align: left;
          color: inherit;
          font: inherit;
        }

        button.card {
          cursor: pointer;
          outline: none;
        }

        button.card:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }

        /* Padding */
        .card-pad-none { padding: 0; }
        .card-pad-sm { padding: var(--sp-4); }
        .card-pad-md { padding: var(--sp-6); }
        .card-pad-lg { padding: var(--sp-8); }

        /* Variants */
        .card-elevated {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(40px);
          border-color: var(--border-medium);
          box-shadow: var(--shadow-md);
        }

        .card-glow {
          border-color: var(--border-accent);
          box-shadow: var(--shadow-glow-primary);
        }

        .card-interactive:hover {
          border-color: var(--border-medium);
          background: var(--surface-glass-hover);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .card-interactive:active {
          transform: translateY(0);
        }
      `}</style>
    </>
  );
}
