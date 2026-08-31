"use client";

import { useActionState, useRef, useEffect } from "react";
import { createAdmin } from "@/app/admin/actions";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
const labelClass = "mb-1 block text-xs font-medium text-neutral-600";

export function CreateAdminForm() {
  const [message, formAction, isPending] = useActionState(createAdmin, null);
  const formRef = useRef<HTMLFormElement>(null);
  const succeeded = message?.startsWith("Admin account created");

  useEffect(() => {
    if (succeeded) formRef.current?.reset();
  }, [succeeded]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" name="email" className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <input type="password" name="password" className={inputClass} minLength={8} required />
        </div>
      </div>
      {message && (
        <p className={`text-sm ${succeeded ? "text-green-700" : "text-red-600"}`}>{message}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-forest px-5 py-2 text-sm text-white transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create Admin Account"}
      </button>
    </form>
  );
}
