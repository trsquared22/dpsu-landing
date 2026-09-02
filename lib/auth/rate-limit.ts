import "server-only";

import { prisma } from "@/lib/db";

// Two independent thresholds, whichever trips first blocks the attempt:
// - per email, so one account can't be brute-forced even from many IPs
// - per IP, so one machine can't brute-force many different admin emails
const EMAIL_WINDOW_MINUTES = 15;
const EMAIL_MAX_ATTEMPTS = 5;
const IP_WINDOW_MINUTES = 15;
const IP_MAX_ATTEMPTS = 20;
const RETENTION_HOURS = 24;

export function getClientIp(headerList: Headers): string {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = headerList.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

// Checked before verifying credentials. Returns a user-facing lockout
// message if this email or IP has too many recent failures, otherwise null.
export async function checkLoginRateLimit(email: string, ip: string): Promise<string | null> {
  const now = Date.now();

  // Best-effort housekeeping so this table doesn't grow unbounded; never
  // block a login attempt if this fails.
  prisma.loginAttempt
    .deleteMany({ where: { createdAt: { lt: new Date(now - RETENTION_HOURS * 60 * 60 * 1000) } } })
    .catch((err) => console.error("Failed to prune old login attempts:", err));

  const emailFailures = await prisma.loginAttempt.count({
    where: { email, success: false, createdAt: { gte: new Date(now - EMAIL_WINDOW_MINUTES * 60 * 1000) } },
  });
  if (emailFailures >= EMAIL_MAX_ATTEMPTS) {
    return `Too many failed attempts for this account. Please try again in ${EMAIL_WINDOW_MINUTES} minutes.`;
  }

  const ipFailures = await prisma.loginAttempt.count({
    where: { ip, success: false, createdAt: { gte: new Date(now - IP_WINDOW_MINUTES * 60 * 1000) } },
  });
  if (ipFailures >= IP_MAX_ATTEMPTS) {
    return `Too many failed attempts from this network. Please try again in ${IP_WINDOW_MINUTES} minutes.`;
  }

  return null;
}

export async function recordLoginAttempt(email: string, ip: string, success: boolean) {
  await prisma.loginAttempt.create({ data: { email, ip, success } });
}
