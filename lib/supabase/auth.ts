// ═══════════════════════════════════════════════════════════
// Readify — Auth Helper Functions
// All auth operations centralized here
// ═══════════════════════════════════════════════════════════

import { createClient } from './client';
import type { AuthUser } from '@/types/user';

/**
 * Sign up a new user with email and password.
 */
export async function signUp(email: string, password: string, name: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in with email and password.
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get the current authenticated user from the browser client.
 */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  return {
    id: user.id,
    email: user.email || '',
    user_metadata: user.user_metadata as { name?: string; avatar_url?: string },
  };
}

/**
 * Get the current session.
 */
export async function getSession() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

/**
 * Listen for auth state changes. Returns unsubscribe function.
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = createClient();
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription.unsubscribe;
}
