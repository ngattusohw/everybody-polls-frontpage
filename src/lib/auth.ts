import { createClient } from '@supabase/supabase-js';
import { BACKEND_URL, PUBLIC_API_KEY } from './backend';

export const AUTH_STORAGE_KEY = 'everybody-polls-web-auth';

const authFetch: typeof fetch = async (input, init) => {
  const controller = new AbortController();
  const originalSignal = init?.signal;
  const abort = () => controller.abort();
  originalSignal?.addEventListener('abort', abort, { once: true });
  if (originalSignal?.aborted) controller.abort();
  const timeout = window.setTimeout(abort, 15000);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
    originalSignal?.removeEventListener('abort', abort);
  }
};

// Keep this browser's session separate from the mobile application's session.
export const authClient = createClient(BACKEND_URL, PUBLIC_API_KEY, {
  global: { fetch: authFetch },
  auth: {
    storageKey: AUTH_STORAGE_KEY,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

export interface SignInMethods {
  email: boolean;
  google: boolean;
  nativeApple: boolean;
}

export async function getSignInMethods(signal: AbortSignal): Promise<SignInMethods> {
  const response = await fetch(`${BACKEND_URL}/auth/v1/settings`, {
    headers: { apikey: PUBLIC_API_KEY }, signal,
  });
  if (!response.ok) throw new Error('Sign-in settings unavailable');
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('external' in data) ||
      !data.external || typeof data.external !== 'object') {
    throw new Error('Invalid sign-in settings');
  }
  const external = data.external as Record<string, unknown>;
  return {
    email: external.email === true,
    google: external.google === true,
    // Apple is configured for native ID-token sign-in, not browser OAuth.
    nativeApple: external.apple === true,
  };
}

export async function clearBrowserSession(): Promise<void> {
  try {
    // The account endpoint revokes all sessions. Clear the browser SDK as well.
    await authClient.auth.signOut({ scope: 'local' });
  } finally {
    for (const key of Object.keys(window.localStorage)) {
      if (key === AUTH_STORAGE_KEY || key.startsWith(`${AUTH_STORAGE_KEY}-`)) {
        window.localStorage.removeItem(key);
      }
    }
  }
}
