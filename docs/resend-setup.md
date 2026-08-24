# Resend setup (parked as of 2026-08-23)

Membership emails currently send through Gmail SMTP (see `app/api/register/route.ts`
and `lib/mailer.ts`), not Resend. This doc records the Resend setup that was in
place before the switch, so it can be restored once a working domain exists.

## Why we switched away

Resend (like every transactional email API - SendGrid, Postmark, Mailgun, etc.)
requires a verified domain before it will send to arbitrary recipients. Without
one, an account is sandboxed to only send to the address the Resend account
itself is registered under - unusable for a membership form that needs to email
both an internal inbox and whichever address the applicant typed in.

The domain that was meant to be verified, `dominicapsu.dm`, does not currently
resolve in DNS at all. Checked directly against Google's (8.8.8.8) and
Cloudflare's (1.1.1.1) public resolvers on 2026-08-23 - both returned
`Non-existent domain` for the domain itself (not just the specific records),
meaning the domain has no active nameserver delegation yet. This is a
registrar-side issue (domain not fully active, or nameservers never set),
not a DNS-record-content issue. See the "DNS records Resend requires" section
below for what to configure once the domain itself resolves.

## Account details

- Resend account: logged in as `trsquared22@gmail.com`
- API key: stored in `.env.local` as `RESEND_API_KEY` (kept there, unused, for
  when this is revisited)
- Intended sending domain: `dominicapsu.dm`

## DNS records Resend requires for `dominicapsu.dm`

From Resend's domain verification page (Domain → DNS Records):

| Purpose | Type | Name | Value |
|---|---|---|---|
| DKIM | TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeqyRrNiDaI1AmUyVUiafVKAZ1ciAecpeCbmh6VLBdOaqBoKG4PKupmgjRGi3g00N6671bVHPjmwt5eK2/BS318MyHC+fUtBt/j3Mvs1ETW5Mhi5k2fdXpd8HAICCZGagUxvTF8GdLPl3g4BTaGzFbeZ8k+QPG0V6BO4s7FOUTtQIDAQAB` |
| SPF | CNAME | `send` | `send.forge.rmta.net` |
| SPF | CNAME | `rsend` | `rsend.forge.rmta.net` |
| DMARC (optional) | TXT | `_dmarc` | `v=DMARC1; p=none;` |
| Inbound receiving (optional) | MX | `@` (root) | `inbound-smtp.us-east-1.amazonaws.com`, priority `10` |

These were already entered into Vercel's DNS panel for the domain as of
2026-08-23 (matching content, modulo trailing dots which are harmless). They
show as "pending" in Resend purely because the domain isn't delegated yet -
once the registrar issue is fixed and the domain actually resolves, these
same records should verify on their own without needing to be re-entered.

## How to resume Resend once the domain works

1. Confirm the domain resolves: `nslookup -type=NS dominicapsu.dm 8.8.8.8`
   should return real nameservers, not "Non-existent domain".
2. Wait for Resend's dashboard to show the domain and all records as
   "Verified" (can take a while after the domain itself starts resolving).
3. Update `.env.local` (and your hosting provider's env vars):
   ```
   RESEND_FROM_EMAIL="DPSU Membership <membership@dominicapsu.dm>"
   ```
   (or whatever local part you prefer on the verified domain).
4. Swap `app/api/register/route.ts` back to using the `resend` package
   instead of `lib/mailer.ts` - see the code below.
5. `resend` is already left in `package.json` so no reinstall is needed.

### Reference: the Resend-based route handler

This is the version of the email-sending logic that used Resend, kept here so
it doesn't need to be reconstructed from scratch:

```ts
import { Resend } from "resend";

// ... buildInternalEmailHtml / buildApplicantEmailHtml / escapeHtml / row
// stayed the same - only the sending block below differs from the
// Gmail SMTP version.

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "DPSU Membership <onboarding@resend.dev>";
const notificationEmail = process.env.DPSU_NOTIFICATION_EMAIL;

if (!apiKey || !notificationEmail) {
  console.error("Membership application received but email is not configured:", data);
  return Response.json(
    { ok: false, error: "Email sending is not configured on the server yet." },
    { status: 500 }
  );
}

const resend = new Resend(apiKey);

const [internalResult, applicantResult] = await Promise.allSettled([
  resend.emails.send({
    from: fromEmail,
    to: notificationEmail,
    subject: `New DPSU Membership Application: ${fullName(data)}`,
    html: buildInternalEmailHtml(data),
  }),
  resend.emails.send({
    from: fromEmail,
    to: data.email,
    subject: "Your DPSU Membership Application Has Been Received",
    html: buildApplicantEmailHtml(data),
  }),
]);

// IMPORTANT: resend.emails.send() resolves (never rejects) on API-level
// errors, returning { data: null, error } instead of throwing - a bug we
// hit and fixed on 2026-08-19. Check settled.value.error, not just
// settled.status === "rejected":
const internalError =
  internalResult.status === "rejected" ? internalResult.reason : internalResult.value.error;
const applicantError =
  applicantResult.status === "rejected" ? applicantResult.reason : applicantResult.value.error;

if (internalError) {
  console.error("Failed to send internal notification email:", internalError, data);
}
if (applicantError) {
  console.error("Failed to send applicant confirmation email:", applicantError);
}

if (internalError && applicantError) {
  return Response.json({ ok: false, error: "Failed to send emails. Please try again shortly." }, { status: 502 });
}

return Response.json({ ok: true });
```

## Current (Gmail SMTP) setup for comparison

See `lib/mailer.ts` and `.env.example` for the active setup: sends via Gmail
SMTP using an App Password, no domain required, but capped at Gmail's daily
send limits (~500/day on a regular account) and more likely to land in spam
than a properly SPF/DKIM-verified custom domain.
