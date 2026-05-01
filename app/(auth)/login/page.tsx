'use client';

// ═══════════════════════════════════════════════════════════
// Readify — Login Page
// ═══════════════════════════════════════════════════════════

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/supabase/auth';
import Button from '@/components/ui/Button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/books';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="login-page">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue your reading journey</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="form-group">
            <label className="input-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="auth-switch">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="auth-switch-link">Create one</Link>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          width: 100%;
        }

        .auth-title {
          font-family: var(--font-display);
          font-size: var(--fs-2xl);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          margin-bottom: var(--sp-2);
        }

        .auth-subtitle {
          font-size: var(--fs-base);
          color: var(--text-tertiary);
          margin-bottom: var(--sp-8);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--sp-5);
        }

        .auth-error {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-3) var(--sp-4);
          background: var(--accent-warm-glow);
          border: 1px solid rgba(255, 107, 107, 0.2);
          border-radius: var(--radius-md);
          color: var(--accent-warm);
          font-size: var(--fs-sm);
        }

        .auth-switch {
          margin-top: var(--sp-6);
          text-align: center;
          font-size: var(--fs-sm);
          color: var(--text-tertiary);
        }

        .auth-switch-link {
          color: var(--accent-primary);
          font-weight: var(--fw-medium);
        }

        .auth-switch-link:hover {
          color: var(--accent-primary-hover);
        }
      `}</style>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading application...</div>}>
      <LoginForm />
    </Suspense>
  );
}
