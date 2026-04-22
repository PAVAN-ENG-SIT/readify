'use client';

import React from 'react';

// ═══════════════════════════════════════════════════════════
// READIFY — Button Component
// Variants: primary, secondary, ghost, danger
// Sizes: sm, md, lg
// ═══════════════════════════════════════════════════════════

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <>
      <button
        className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="btn-spinner" />
        ) : icon ? (
          <span className="btn-icon">{icon}</span>
        ) : null}
        {children && <span className="btn-label">{children}</span>}
      </button>

      <style jsx>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--sp-2);
          font-family: var(--font-body);
          font-weight: var(--fw-semibold);
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--duration-normal) var(--ease-out);
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          outline: none;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }

        /* Sizes */
        .btn-sm {
          padding: var(--sp-2) var(--sp-3);
          font-size: var(--fs-sm);
          border-radius: var(--radius-sm);
        }

        .btn-md {
          padding: var(--sp-3) var(--sp-5);
          font-size: var(--fs-base);
        }

        .btn-lg {
          padding: var(--sp-4) var(--sp-8);
          font-size: var(--fs-md);
          border-radius: var(--radius-lg);
        }

        .btn-full {
          width: 100%;
        }

        /* Primary */
        .btn-primary {
          background: var(--gradient-primary);
          color: white;
          box-shadow: 0 2px 12px var(--accent-primary-glow);
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 4px 24px var(--accent-primary-glow);
          transform: translateY(-1px);
        }

        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }

        /* Secondary */
        .btn-secondary {
          background: var(--surface-glass);
          color: var(--text-primary);
          border: 1px solid var(--border-medium);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--surface-glass-hover);
          border-color: var(--border-strong);
        }

        /* Ghost */
        .btn-ghost {
          background: transparent;
          color: var(--text-secondary);
        }

        .btn-ghost:hover:not(:disabled) {
          background: var(--surface-glass);
          color: var(--text-primary);
        }

        /* Danger */
        .btn-danger {
          background: var(--accent-warm);
          color: white;
          box-shadow: 0 2px 12px var(--accent-warm-glow);
        }

        .btn-danger:hover:not(:disabled) {
          box-shadow: 0 4px 24px var(--accent-warm-glow);
          transform: translateY(-1px);
        }

        /* Spinner */
        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .btn-icon {
          display: flex;
          align-items: center;
          font-size: 1.1em;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
