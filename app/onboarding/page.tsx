'use client';

// ═══════════════════════════════════════════════════════════
// READIFY — Onboarding Page (Layer 2)
// Sets timezone and completes user profile
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { detectTimezone } from '@/lib/utils/date';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timezone, setTimezone] = useState('');

  useEffect(() => {
    // Detect and pre-fill timezone
    setTimezone(detectTimezone());
  }, []);

  async function handleComplete() {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          timezone,
          onboarded: true 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      router.push('/books');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="onboarding-layout">
        <div className="onboarding-container glass">
          <div className="onboarding-header">
            <span className="onboarding-icon">🌍</span>
            <h1 className="onboarding-title">Let&apos;s get you set up</h1>
            <p className="onboarding-desc">
              To track your daily reading streaks accurately, we need to know your timezone.
              This prevents false streak breaks.
            </p>
          </div>

          {error && (
            <div className="onboarding-error">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="form-group">
            <label className="input-label" htmlFor="timezone">Your Timezone</label>
            <input
              id="timezone"
              type="text"
              className="input"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="e.g. America/New_York"
              required
            />
            <p className="input-help">We auto-detected this for you.</p>
          </div>

          <Button 
            onClick={handleComplete} 
            fullWidth 
            size="lg" 
            isLoading={loading}
          >
            Complete Setup
          </Button>
        </div>
      </div>

      <style jsx>{`
        .onboarding-layout {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--sp-6);
          background: var(--gradient-hero);
        }

        .onboarding-container {
          max-width: 480px;
          width: 100%;
          padding: var(--sp-10) var(--sp-8);
          animation: fadeInUp var(--duration-slow) var(--ease-out);
        }

        .onboarding-header {
          text-align: center;
          margin-bottom: var(--sp-8);
        }

        .onboarding-icon {
          font-size: 3rem;
          margin-bottom: var(--sp-4);
          display: inline-block;
        }

        .onboarding-title {
          font-family: var(--font-display);
          font-size: var(--fs-2xl);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          margin-bottom: var(--sp-2);
        }

        .onboarding-desc {
          color: var(--text-secondary);
          line-height: var(--lh-relaxed);
        }

        .onboarding-error {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-3) var(--sp-4);
          background: var(--accent-warm-glow);
          border: 1px solid rgba(255, 107, 107, 0.2);
          border-radius: var(--radius-md);
          color: var(--accent-warm);
          font-size: var(--fs-sm);
          margin-bottom: var(--sp-6);
        }

        .input-help {
          font-size: var(--fs-xs);
          color: var(--text-tertiary);
          margin-top: var(--sp-2);
        }
      `}</style>
    </>
  );
}
