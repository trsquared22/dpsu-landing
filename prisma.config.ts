import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// dotenv only loads .env by default; .env.local is a Next.js-specific
// convention it doesn't know about, so it's loaded explicitly here.
config({ path: ".env.local" });

// Prisma 7 moved the CLI's datasource connection (used by `prisma migrate`/
// `prisma generate`) out of schema.prisma and into this file. The runtime
// PrismaClient still gets its own connection separately, via the driver
// adapter in lib/db.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
