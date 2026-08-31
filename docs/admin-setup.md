# Admin area setup

`/admin` is a login-protected area (`app/admin/`) where DPSU staff can view, add,
edit, and delete membership applications stored in the database (see
`docs/database-setup.md`).

## Authentication

Hand-rolled, following [Next.js's own recommended pattern](https://nextjs.org/docs/app/guides/authentication)
rather than next-auth/Auth.js, since there's no OAuth provider need for a
handful of staff logins:

- `bcryptjs` hashes passwords (`lib/auth/password.ts`).
- `jose` signs a stateless session JWT into an httpOnly cookie (`lib/auth/session.ts`).
- `lib/dal.ts`'s `verifySession()` is the actual authorization check, called
  from every admin page/Server Action.
- `proxy.ts` (repo root) only does an optimistic cookie-presence/signature
  check to redirect anonymous visitors away from `/admin/*` before render -
  it never queries the database.

Requires `DPSU_SESSION_SECRET` in `.env.local` (generate with `openssl rand -base64 32`).

## Creating the first admin account

There's no public signup page by design - the bootstrap problem is that the
in-app way to add an admin (below) requires already being logged in as one.
For that very first account only, use the CLI script:

```
npx tsx scripts/seed-admin.ts you@example.com "a-strong-password"
```

This also works to reset a forgotten password later (run it again with the
same email) - useful if the in-app account with access ever gets locked out.

## Adding more admins (no terminal needed)

Once signed in, go to **Team** in the sidebar (`/admin/team`). Any signed-in
admin can add another one there with just an email and password - no CLI
access required. This is the normal way to onboard staff; the terminal script
above is only needed for that first bootstrap account or a password reset.

The Team page also lists existing admins and lets you remove one, with two
safety rails built in: you can't remove your own account, and you can't remove
the last remaining admin - both to avoid locking everyone out.

## Logging in

Visit `/admin/login`, sign in, and you'll land on the dashboard at `/admin`.
