"use client";

import { useTransition } from "react";
import { updateApplicationStatus } from "@/app/admin/actions";

export function StatusSelect({
  applicationId,
  status,
  badgeClassName,
}: {
  applicationId: string;
  status: string;
  badgeClassName: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          await updateApplicationStatus(applicationId, next);
        });
      }}
      className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium capitalize focus:outline-none focus:ring-2 focus:ring-forest/30 disabled:opacity-50 ${badgeClassName}`}
    >
      <option value="pending">Pending</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  );
}
