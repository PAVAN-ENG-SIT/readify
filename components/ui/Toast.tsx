'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { TOAST_DURATION_MS } from '@/lib/utils/constants';

// ═══════════════════════════════════════════════════════════
// READIFY — Toast Notification System
// Context-based toast with auto-dismiss and animations
// ═══════════════════════════════════════════════════════════

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = TOAST_DURATION_MS) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      <style jsx>{`
        .toast-container {
          position: fixed;
          top: var(--sp-4);
          right: var(--sp-4);
          z-index: var(--z-toast);
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
          pointer-events: none;
          max-width: 400px;
        }
      `}</style>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const iconMap: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <>
      <div className={`toast toast-${toast.type} ${isExiting ? 'toast-exit' : ''}`}>
        <span className="toast-icon">{iconMap[toast.type]}</span>
        <span className="toast-message">{toast.message}</span>
        <button
          className="toast-dismiss"
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onRemove(toast.id), 300);
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      <style jsx>{`
        .toast {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-3) var(--sp-4);
          border-radius: var(--radius-lg);
          background: var(--bg-elevated);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(20px);
          pointer-events: auto;
          animation: toastSlideIn 0.3s var(--ease-spring);
        }

        .toast-exit {
          animation: toastSlideOut 0.3s var(--ease-out) forwards;
        }

        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: var(--fs-xs);
          font-weight: var(--fw-bold);
          flex-shrink: 0;
        }

        .toast-success .toast-icon {
          background: var(--accent-green-glow);
          color: var(--accent-green);
        }
        .toast-error .toast-icon {
          background: var(--accent-warm-glow);
          color: var(--accent-warm);
        }
        .toast-warning .toast-icon {
          background: var(--accent-gold-glow);
          color: var(--accent-gold);
        }
        .toast-info .toast-icon {
          background: var(--accent-primary-glow);
          color: var(--accent-primary);
        }

        .toast-message {
          flex: 1;
          font-size: var(--fs-sm);
          color: var(--text-primary);
          line-height: var(--lh-snug);
        }

        .toast-dismiss {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: var(--sp-1);
          font-size: var(--fs-xs);
          flex-shrink: 0;
          transition: color var(--duration-fast);
        }

        .toast-dismiss:hover {
          color: var(--text-primary);
        }

        @keyframes toastSlideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes toastSlideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
