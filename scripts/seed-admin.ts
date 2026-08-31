// Creates (or updates the password of) an admin account. This is the only
// way an AdminUser row is ever created - there is no public signup route.
//
// Usage: npx tsx scripts/seed-admin.ts <email> <password>

// Standalone tsx execution doesn't get Next.js's automatic .env.local
// loading. Static imports are hoisted above this call regardless of source
// order, so lib/db (which reads DATABASE_URL at module scope) is imported
// dynamically below, after the env is actually loaded.
import { config } from "dotenv";
config({ path: ".env.local" });

import { hashPassword } from "../lib/auth/password";

async function main() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/seed-admin.ts <email> <password>");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const { prisma } = await import("../lib/db");

  const passwordHash = await hashPassword(password);
  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Admin account ready: ${admin.email} (id: ${admin.id})`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
