import { jwtVerify, SignJWT } from "jose";

const secretKey = process.env.DPSU_SESSION_SECRET;
if (!secretKey) {
  throw new Error("DPSU_SESSION_SECRET is not set");
}
const encodedKey = new TextEncoder().encode(secretKey);

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export const SESSION_COOKIE_NAME = "dpsu_admin_session";

export interface SessionPayload {
  adminId: string;
}

export async function encryptSession(adminId: string): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const token = await new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey);
  return { token, expiresAt };
}

export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    if (typeof payload.adminId !== "string") return null;
    return { adminId: payload.adminId };
  } catch {
    return null;
  }
}
