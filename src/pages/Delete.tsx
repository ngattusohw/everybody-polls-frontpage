import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AlertTriangle, CheckCircle2, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authClient, clearBrowserSession, getSignInMethods, type SignInMethods } from '@/lib/auth';
import { BACKEND_URL, PUBLIC_API_KEY } from '@/lib/backend';

export default function Delete() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [methods, setMethods] = useState<SignInMethods | null>(null);
  const [settingsAttempt, setSettingsAttempt] = useState(0);
  const [settingsError, setSettingsError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [deleted, setDeleted] = useState(false);
  const requestInFlight = useRef(false);

  useEffect(() => {
    let active = true;
    let verification = 0;
    async function verifySession(next: Session | null) {
      const current = ++verification;
      if (!next) {
        if (active) { setSession(null); setCheckingSession(false); }
        return;
      }
      if (active) setCheckingSession(true);
      try {
        const { data, error: authError } = await authClient.auth.getUser(next.access_token);
        if (!active || current !== verification) return;
        if (authError || !data.user) {
          setSession(null);
          setError('We couldn’t verify your session. Please sign in again.');
        } else {
          setSession({ ...next, user: data.user });
        }
      } catch {
        if (active && current === verification) {
          setSession(null);
          setError('We couldn’t verify your session. Please sign in again.');
        }
      } finally {
        if (active && current === verification) setCheckingSession(false);
      }
    }
    const { data: { subscription } } = authClient.auth.onAuthStateChange((event, next) => {
      if (event === 'INITIAL_SESSION') return;
      setConfirmation('');
      setAcknowledged(false);
      void verifySession(next);
    });
    void authClient.auth.getSession().then(({ data, error: authError }) => {
      if (!active) return;
      if (authError) {
        setError('Your sign-in has expired. Please sign in again.');
        setCheckingSession(false);
      } else {
        void verifySession(data.session);
      }
    }).catch(() => {
      if (active) {
        setError('We couldn’t check your session. Please sign in again.');
        setCheckingSession(false);
      }
    });
    return () => { active = false; verification++; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    setSettingsError(false);
    setMethods(null);
    void getSignInMethods(controller.signal).then(value => {
      if (active) setMethods(value);
    }).catch(() => {
      if (active) setSettingsError(true);
    }).finally(() => window.clearTimeout(timeout));
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [settingsAttempt]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestInFlight.current || !methods?.email) return;
    requestInFlight.current = true;
    setBusy(true);
    setError('');
    try {
      const { error: authError } = await authClient.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) setError('We couldn’t sign you in. Check your email and password, or use your original sign-in method.');
    } catch {
      setError('Sign-in is unavailable right now. Please try again.');
    } finally {
      setPassword('');
      requestInFlight.current = false;
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    if (requestInFlight.current || !methods?.google) return;
    requestInFlight.current = true;
    setBusy(true);
    setError('');
    try {
      const { error: authError } = await authClient.auth.signInWithOAuth({
        provider: 'google', options: { redirectTo: `${window.location.origin}/delete` },
      });
      if (authError) setError('Google sign-in couldn’t be started. Please try again.');
    } catch {
      setError('Google sign-in is unavailable right now. Please try again.');
    } finally {
      requestInFlight.current = false;
      setBusy(false);
    }
  }

  async function useAnotherAccount() {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setBusy(true);
    setError('');
    try { await clearBrowserSession(); }
    catch { setError('The browser sign-out could not be completed. Please reload this page.'); }
    finally {
      setSession(null);
      setConfirmation('');
      setAcknowledged(false);
      requestInFlight.current = false;
      setBusy(false);
    }
  }

  async function deleteAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestInFlight.current || !session || confirmation !== 'DELETE' || !acknowledged) return;
    requestInFlight.current = true;
    setBusy(true);
    setError('');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const { data, error: authError } = await authClient.auth.getSession();
      if (authError || !data.session || data.session.user.id !== session.user.id) {
        setError('Your sign-in changed. Please sign in again and review the account before deleting.');
        setSession(null);
        return;
      }
      const response = await fetch(`${BACKEND_URL}/functions/v1/account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${data.session.access_token}`, apikey: PUBLIC_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: 'DELETE' }),
        signal: controller.signal,
      });
      if (response.status === 401) {
        await clearBrowserSession();
        setSession(null);
        setError('Your session expired. Sign in again to delete your account.');
        return;
      }
      if (!response.ok) {
        setError(response.status === 429
          ? 'Too many attempts. Please wait a moment before trying again.'
          : 'We couldn’t delete your account. Please try again.');
        return;
      }
      const result: unknown = await response.json();
      if (!result || typeof result !== 'object' || !('deleted' in result) || result.deleted !== true) {
        setError('We couldn’t confirm deletion. Please sign in again before retrying.');
        return;
      }
      setDeleted(true);
      setSession(null);
      await clearBrowserSession().catch(() => { /* Scoped browser storage is cleared in finally. */ });
    } catch {
      setError('We couldn’t confirm deletion. Check your connection and sign in again before retrying.');
    } finally {
      window.clearTimeout(timeout);
      setConfirmation('');
      setAcknowledged(false);
      requestInFlight.current = false;
      setBusy(false);
    }
  }

  return <main className="account-page"><div className="account-shell">
    <p className="eyebrow">YOUR ACCOUNT</p>
    <h1>{deleted ? 'Account deleted' : 'Delete Account'}</h1>
    {deleted ? <section className="account-card account-success" aria-live="polite">
      <CheckCircle2 size={35} aria-hidden="true" />
      <h2>Your account has been deleted.</h2>
      <p>You’re signed out of this browser. Your account and associated personal data have been permanently removed.</p>
      <Link className="primary-button" to="/">Back to Everybody Polls</Link>
    </section> : <section className="account-card" aria-busy={busy || checkingSession}>
      {error && <p className="account-error" role="alert">{error}</p>}
      {checkingSession ? <p role="status">Checking your sign-in…</p> : session ? <>
        <div className="account-identity"><LockKeyhole size={19} aria-hidden="true" /><div><span>Signed in as</span><strong>{session.user.email || 'your signed-in account'}</strong></div></div>
        <button type="button" className="text-button account-switch" disabled={busy} onClick={() => void useAnotherAccount()}>Use another account</button>
        <div className="account-warning"><AlertTriangle size={21} aria-hidden="true" /><div><h2>This is permanent.</h2><p>Deleting your account removes your account and associated personal data. You won’t be able to undo this or sign back in to this account.</p></div></div>
        <form className="account-form" onSubmit={event => void deleteAccount(event)}>
          <label className="account-checkbox"><input type="checkbox" checked={acknowledged} disabled={busy} onChange={event => setAcknowledged(event.target.checked)} /><span>I understand that my account will be permanently deleted.</span></label>
          <div><label htmlFor="delete-confirmation">Type DELETE to confirm</label><input id="delete-confirmation" type="text" value={confirmation} onChange={event => setConfirmation(event.target.value)} disabled={busy} autoComplete="off" autoCapitalize="characters" spellCheck={false} aria-describedby="delete-confirmation-help" /><p id="delete-confirmation-help" className="account-helper">The account shown above is the one that will be deleted.</p></div>
          <button type="submit" className="account-delete-button" disabled={busy || !acknowledged || confirmation !== 'DELETE'}>{busy ? 'Deleting account…' : 'Permanently delete my account'}</button>
          {!busy && <Link className="account-cancel" to="/">Keep my account and go back</Link>}
        </form>
      </> : <>
        <div className="account-intro"><LockKeyhole size={24} aria-hidden="true" /><h2>First, sign in to your account.</h2><p>Use the same account you use in Everybody Polls. Signing in does not delete anything.</p></div>
        {!methods && !settingsError && <p className="account-loading" role="status">Loading sign-in options…</p>}
        {settingsError && <div className="account-settings-error" role="alert"><p>Sign-in options couldn’t be loaded. Please try again.</p><button type="button" className="secondary-button" onClick={() => setSettingsAttempt(attempt => attempt + 1)}>Try again</button></div>}
        {methods?.google && <button type="button" className="secondary-button account-provider" disabled={busy} onClick={() => void signInWithGoogle()}>Continue with Google</button>}
        {methods?.email && <form className="account-form" onSubmit={event => void signIn(event)}>
          <div><label htmlFor="account-email">Email address</label><input id="account-email" type="email" required autoComplete="username" value={email} disabled={busy} onChange={event => setEmail(event.target.value)} /></div>
          <div><label htmlFor="account-password">Password</label><input id="account-password" type="password" required autoComplete="current-password" value={password} disabled={busy} onChange={event => setPassword(event.target.value)} /></div>
          <button type="submit" className="primary-button" disabled={busy}>{busy ? 'Signing in…' : 'Sign in to continue'}</button>
          <p className="account-helper">For existing email and password accounts.</p>
        </form>}
        {methods?.nativeApple && <aside className="account-apple"><h3>Do you sign in with Apple?</h3><p>Use the iOS app to delete your Apple-connected account. Open Account at the top right, then choose Delete account.</p></aside>}
        {methods && !methods.email && !methods.google && !methods.nativeApple && <p>Sign-in is unavailable right now. Please try again later.</p>}
        <p className="account-support">Need help accessing your account? <a href="mailto:privacy@everybodypolls.com">Contact us</a>.</p>
      </>}
    </section>}
    {!deleted && <Link to="/privacy" className="account-privacy">Read our privacy policy</Link>}
  </div></main>;
}
