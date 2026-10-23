"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) setError(data.error || "Could not sign in.");
      else router.replace("/admin");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="admin-login-page">
    <section className="admin-login-card">
      <div className="admin-login-mark"><LockKeyhole size={24} strokeWidth={1.7} /></div>
      <p className="admin-kicker">LHIMF / ADMINISTRATION</p>
      <h1>Welcome back.</h1>
      <p className="admin-login-copy">Sign in to manage order inquiries and customer submissions.</p>
      <form className="admin-form" onSubmit={submit}>
        <label htmlFor="admin-email">Admin email</label>
        <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} />
        <label htmlFor="admin-password">Password</label>
        <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="admin-primary-button" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
      <p className="admin-secure-note"><ShieldCheck size={15} /> Protected admin access</p>
      <a className="admin-back-link" href="/">← Back to LHIMF</a>
    </section>
  </main>;
}
