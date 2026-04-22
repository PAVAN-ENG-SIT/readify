'use client';

import React, { useEffect, useState } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import { useReaderStore } from '@/store/useReaderStore';
import { formatTimer } from '@/lib/utils/date';
import Button from '@/components/ui/Button';

export default function ReaderPanel() {
  const { isPanelOpen, activeBookId, closePanel } = useReaderStore();
  const {
    isActive,
    isPaused,
    elapsedSeconds,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    incrementTime,
    incrementIdle,
    resetIdle,
    sendHeartbeat
  } = useSessionStore();

  const [startPage, setStartPage] = useState<number>(0);
  const [endPage, setEndPage] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        incrementTime();
        incrementIdle();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, incrementTime, incrementIdle]);

  // Heartbeat loop (every 30s)
  useEffect(() => {
    let hbInterval: NodeJS.Timeout;
    if (isActive) {
      hbInterval = setInterval(() => {
        sendHeartbeat();
      }, 30000);
    }
    return () => clearInterval(hbInterval);
  }, [isActive, sendHeartbeat]);

  // Activity listeners to reset idle
  useEffect(() => {
    if (!isActive) return;
    const handleActivity = () => resetIdle();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [isActive, resetIdle]);

  if (!isPanelOpen) return null;

  const handleStart = async () => {
    if (activeBookId) {
      await startSession(activeBookId, startPage);
    }
  };

  const handleEnd = async () => {
    if (endPage === '' || endPage < startPage) {
      alert('Please enter a valid ending page number.');
      return;
    }
    await endSession(Number(endPage), notes);
    closePanel();
  };

  return (
    <div className="reader-overlay">
      <div className="reader-panel glass">
        <div className="reader-header">
          <h2>Reading Session</h2>
          <button className="close-btn" onClick={closePanel}>✕</button>
        </div>

        <div className="reader-content">
          {!isActive ? (
            <div className="start-form animate-fade-in">
              <p className="text-secondary mb-4">Start a new reading session for this book.</p>
              <div className="form-group">
                <label className="input-label">Starting Page</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  value={startPage}
                  onChange={(e) => setStartPage(Number(e.target.value))}
                />
              </div>
              <Button fullWidth onClick={handleStart} size="lg">Start Reading Session</Button>
            </div>
          ) : (
            <div className="active-session animate-fade-in">
              <div className="timer-display">
                {formatTimer(elapsedSeconds)}
              </div>
              
              <div className="session-status">
                {isPaused ? 'Session Paused' : 'Monitoring Activity...'}
              </div>

              <div className="session-controls">
                {isPaused ? (
                  <Button fullWidth onClick={resumeSession} variant="secondary">Resume Reading</Button>
                ) : (
                  <Button fullWidth onClick={pauseSession} variant="secondary">Pause Reading</Button>
                )}
              </div>

              <div className="end-form">
                <div className="form-group">
                  <label className="input-label">Ending Page</label>
                  <input
                    type="number"
                    className="input"
                    min={startPage}
                    value={endPage}
                    onChange={(e) => setEndPage(Number(e.target.value))}
                    placeholder={`e.g., ${startPage + 10}`}
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Quick Notes (Optional)</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Capture key ideas..."
                  />
                </div>
                <Button fullWidth onClick={handleEnd} variant="danger">End Session</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .reader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: var(--z-modal);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--sp-4);
        }

        .reader-panel {
          width: 100%;
          max-width: 480px;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .reader-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--sp-5) var(--sp-6);
          border-bottom: 1px solid var(--border-subtle);
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-tertiary);
          font-size: var(--fs-md);
          cursor: pointer;
          transition: color var(--duration-fast);
        }

        .close-btn:hover {
          color: var(--text-primary);
        }

        .reader-content {
          padding: var(--sp-6);
        }

        .timer-display {
          font-family: var(--font-mono);
          font-size: 3rem;
          font-weight: var(--fw-bold);
          text-align: center;
          margin-bottom: var(--sp-2);
          color: var(--accent-primary);
          text-shadow: 0 0 20px var(--accent-primary-glow);
        }

        .session-status {
          text-align: center;
          font-size: var(--fs-sm);
          color: var(--text-secondary);
          margin-bottom: var(--sp-6);
          animation: pulse 2s infinite;
        }

        .session-controls {
          margin-bottom: var(--sp-6);
        }

        .end-form {
          border-top: 1px solid var(--border-subtle);
          padding-top: var(--sp-5);
        }

        .mb-4 {
          margin-bottom: var(--sp-4);
        }
      `}</style>
    </div>
  );
}

