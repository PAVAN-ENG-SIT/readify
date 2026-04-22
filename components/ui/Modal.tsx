'use client';

import React, { useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════
// READIFY — Modal Component
// Accessible modal with backdrop, animations, keyboard support
// ═══════════════════════════════════════════════════════════

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showClose?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} aria-hidden="true" />
      <div className="modal-container" role="dialog" aria-modal="true" aria-label={title}>
        <div className={`modal modal-${size}`}>
          {(title || showClose) && (
            <div className="modal-header">
              {title && <h2 className="modal-title">{title}</h2>}
              {showClose && (
                <button className="modal-close" onClick={onClose} aria-label="Close modal">
                  ✕
                </button>
              )}
            </div>
          )}
          <div className="modal-body">{children}</div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: var(--z-modal);
          animation: fadeIn var(--duration-fast) var(--ease-out);
        }

        .modal-container {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--z-modal);
          padding: var(--sp-4);
          pointer-events: none;
        }

        .modal {
          background: var(--bg-elevated);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-xl);
          max-height: 85vh;
          overflow-y: auto;
          pointer-events: auto;
          animation: scaleIn var(--duration-normal) var(--ease-spring);
        }

        .modal-sm { width: min(400px, 100%); }
        .modal-md { width: min(560px, 100%); }
        .modal-lg { width: min(720px, 100%); }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--sp-5) var(--sp-6);
          border-bottom: 1px solid var(--border-subtle);
        }

        .modal-title {
          font-family: var(--font-display);
          font-size: var(--fs-lg);
          font-weight: var(--fw-semibold);
          color: var(--text-primary);
        }

        .modal-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          color: var(--text-tertiary);
          font-size: var(--fs-base);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .modal-close:hover {
          background: var(--surface-glass);
          color: var(--text-primary);
        }

        .modal-body {
          padding: var(--sp-6);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
