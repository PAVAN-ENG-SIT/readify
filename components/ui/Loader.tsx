'use client';

import React from 'react';

// ═══════════════════════════════════════════════════════════
// READIFY — Loader Component
// Spinner + Skeleton variants
// ═══════════════════════════════════════════════════════════

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function Spinner({ size = 'md', color }: SpinnerProps) {
  const sizeMap = { sm: 20, md: 32, lg: 48 };
  const px = sizeMap[size];

  return (
    <>
      <div className="spinner" aria-label="Loading" />
      <style jsx>{`
        .spinner {
          width: ${px}px;
          height: ${px}px;
          border: 3px solid var(--border-subtle);
          border-top-color: ${color || 'var(--accent-primary)'};
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius,
  className = '',
}: SkeletonProps) {
  return (
    <>
      <div className={`skeleton-el ${className}`} />
      <style jsx>{`
        .skeleton-el {
          width: ${width};
          height: ${height};
          border-radius: ${borderRadius || 'var(--radius-md)'};
          background: linear-gradient(
            90deg,
            var(--bg-tertiary) 25%,
            var(--bg-hover) 50%,
            var(--bg-tertiary) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
}

interface PageLoaderProps {
  text?: string;
}

export function PageLoader({ text = 'Loading...' }: PageLoaderProps) {
  return (
    <>
      <div className="page-loader">
        <Spinner size="lg" />
        <p className="page-loader-text">{text}</p>
      </div>
      <style jsx>{`
        .page-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: var(--sp-4);
        }
        .page-loader-text {
          color: var(--text-tertiary);
          font-size: var(--fs-sm);
        }
      `}</style>
    </>
  );
}

export function CardSkeleton() {
  return (
    <>
      <div className="card-skeleton">
        <Skeleton height="160px" borderRadius="var(--radius-lg)" />
        <div className="card-skeleton-body">
          <Skeleton width="70%" height="16px" />
          <Skeleton width="40%" height="14px" />
          <Skeleton width="100%" height="6px" borderRadius="var(--radius-full)" />
        </div>
      </div>
      <style jsx>{`
        .card-skeleton {
          background: var(--gradient-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }
        .card-skeleton-body {
          padding: var(--sp-4);
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
        }
      `}</style>
    </>
  );
}
