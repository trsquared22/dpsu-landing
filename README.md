This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Sanity CMS

Content (news posts, services, membership stats, site settings) is managed in Sanity and queried with GROQ from `app/(site)/page.tsx`. The Studio is embedded at [`/studio`](http://localhost:3000/studio) via [`app/studio/[[...tool]]/page.tsx`](app/studio/%5B%5B...tool%5D%5D/page.tsx) — no separate Studio hosting needed.

- Schemas live in `sanity/schemaTypes/`; the Studio config is `sanity.config.ts` at the repo root.
- Required env vars (see `.env.example`): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_REVALIDATE_SECRET`. Set the same values in your hosting provider's env vars.
- Each dev/deploy origin (e.g. `http://localhost:3000`, your production domain) must be added as a CORS origin with credentials: `npx sanity cors add <origin> --credentials` (run from a directory logged in via `npx sanity login`).
- To pick up edits without a full redeploy, add a webhook in [manage.sanity.io](https://manage.sanity.io) → your project → API → Webhooks pointing at `https://yoursite.com/api/revalidate`, with the **Secret** field set to the same value as `SANITY_REVALIDATE_SECRET`. It calls [`app/api/revalidate/route.ts`](app/api/revalidate/route.ts), which verifies the signature and calls `revalidatePath`.
- The `studio/` folder is a leftover standalone Studio scaffold from before the embedded route existed and is no longer used — safe to delete.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
