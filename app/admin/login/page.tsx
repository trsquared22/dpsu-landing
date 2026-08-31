"use client";

import { useActionState } from "react";
import { login } from "../actions";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
const labelClass = "mb-1.5 block text-sm font-medium text-neutral-700";

export default function AdminLoginPage() {
  const [error, formAction, isPending] = useActionState(login, null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900">DPSU Admin Login</h1>
        <form action={formAction} className="space-y-4">
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} type="email" name="email" autoComplete="username" required />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              className={inputClass}
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-forest px-4 py-2.5 text-white transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
