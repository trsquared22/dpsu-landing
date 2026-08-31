# Database setup

Membership applications (`app/api/register/route.ts`) are persisted to Postgres
via Prisma (`prisma/schema.prisma`, `lib/db.ts`). Before this feature, applications
were only emailed and lost entirely if both emails failed to send.

## Local development

A dedicated `dpsu` role and database live inside a PostgreSQL 18 instance already
installed on the dev machine (not a separate install per-project - if you're
setting this up fresh elsewhere, install Postgres and create a role/database the
same way):

```sql
CREATE ROLE dpsu WITH LOGIN PASSWORD '...';
CREATE DATABASE dpsu OWNER dpsu;
```

`.env.local`:
```
DATABASE_URL=postgresql://dpsu:<password>@localhost:5432/dpsu?schema=public
```

Apply the schema:
```
npx prisma migrate dev
```

## Production deployment

Create a [Neon](https://neon.tech) project (recommended over Supabase - Neon is
plain serverless Postgres with no bundled proprietary Auth/Storage/Realtime
layers pushing vendor lock-in). Set `DATABASE_URL` to Neon's connection string
(with `?sslmode=require`) in your hosting provider's env vars, then run once:

```
npx prisma migrate deploy
```

This only applies already-reviewed migrations from `prisma/migrations/` - it
never generates new ones. No code changes are needed to move providers; this is
why the schema is plain PostgreSQL rather than a vendor-specific format - the
same migration files work against any Postgres, including a self-hosted
instance on a private/LAN-only network later (just `pg_dump`/`pg_restore` the
data across and swap `DATABASE_URL` again).

## Schema changes

Local: `npx prisma migrate dev --name <description>` - generates and commits a
new file under `prisma/migrations/`, regenerates the Prisma client.
Production: `npx prisma migrate deploy` - applies pending migrations only.

## First admin account

There is no public admin signup route. See `docs/admin-setup.md`.

## Why `npm run dev` uses `--webpack`

Turbopack (Next 16's default dev bundler) has a Windows bug where it fails to
create a directory junction point for the `pg` package (`TurbopackInternalError:
failed to create junction point ... Incorrect function. (os error 1)`), breaking
every page load in dev once Prisma/pg are dependencies - not just the routes
that actually use them. Webpack mode has no such issue and works normally. If a
future Next.js/Turbopack release fixes this, `--webpack` can be dropped from the
`dev` script.
