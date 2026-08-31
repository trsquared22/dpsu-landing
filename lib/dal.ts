import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { decryptSession, SESSION_COOKIE_NAME } from "./auth/session";
import { prisma } from "./db";

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await decryptSession(token);

  if (!session?.adminId) {
    redirect("/admin/login");
  }

  return { adminId: session.adminId };
});

export const getCurrentAdmin = cache(async () => {
  const session = await verifySession();
  return prisma.adminUser.findUnique({
    where: { id: session.adminId },
    select: { id: true, email: true },
  });
});
