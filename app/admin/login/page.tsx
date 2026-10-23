
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Could not sign in. Please try again.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section
        className="admin-login-card"
        aria-labelledby="admin-login-title"
      >
        <div className="admin-login-mark" aria-hidden="true">
          <LockKeyhole size={24} strokeWidth={1.7} />
        </div>

        <p className="admin-kicker">LHIMF / ADMINISTRATION</p>
        <h1 id="admin-login-title">Welcome back.</h1>

        <p className="admin-login-copy">
          Sign in to manage order inquiries and customer submissions.
        </p>

        <form className="admin-form" onSubmit={submit}>
          <label htmlFor="admin-email">Admin email</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={busy}
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={busy}
          />

          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="admin-primary-button"
            type="submit"
            disabled={busy}
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="admin-secure-note">
          <ShieldCheck size={15} aria-hidden="true" />
          <span>Protected admin access</span>
        </p>

        <Link className="admin-back-link" href="/">
          ← Back to LHIMF
        </Link>
      </section>
    </main>
  );
}
