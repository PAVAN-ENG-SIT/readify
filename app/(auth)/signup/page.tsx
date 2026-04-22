'use client';

// ═══════════════════════════════════════════════════════════
// Readify — Signup Page
// ═══════════════════════════════════════════════════════════

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/supabase/auth';
import Button from '@/components/ui/Button';

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const data = await signUp(email, password, name);

      // If email confirmation is disabled, redirect directly
      if (data.session) {
        router.push('/onboarding');
        router.refresh();
      } else {
        // Email confirmation required
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <div className="signup-success">
          <div className="success-icon">✉️</div>
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-subtitle">
            We&apos;ve sent a verification link to <strong>{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link href="/login">
            <Button variant="secondary" fullWidth>
              Back to Login
            </Button>
          </Link>
        </div>

        <style jsx>{`
          .signup-success {
            text-align: center;
          }
          .success-icon {
            font-size: 3rem;
            margin-bottom: var(--sp-4);
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
            line-height: var(--lh-relaxed);
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="signup-page">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start building unbreakable reading habits</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="form-group">
            <label className="input-label" htmlFor="signup-name">Name</label>
            <input
              id="signup-name"
              type="text"
              className="input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
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
            <label className="input-label" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              className="input"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="signup-confirm">Confirm Password</label>
            <input
              id="signup-confirm"
              type="password"
              className={`input ${password && confirmPassword && password !== confirmPassword ? 'input-error' : ''}`}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {password && confirmPassword && password !== confirmPassword && (
              <span className="error-text">Passwords don&apos;t match</span>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="auth-switch">
          Already have an account?{' '}
          <Link href="/login" className="auth-switch-link">Sign in</Link>
        </div>
      </div>

      <style jsx>{`
        .signup-page {
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
