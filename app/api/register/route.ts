import { Resend } from "resend";
import { fullName, validateMembershipForm, type MembershipFormData } from "@/lib/membership";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string): string {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#525252;white-space:nowrap;">${label}</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(value)}</td></tr>`;
}

function buildInternalEmailHtml(data: MembershipFormData): string {
  const address = [data.addressLine1, data.addressLine2, data.addressLine3].filter(Boolean).join(", ");
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#171717;">
      <h2 style="color:#2563eb;">New DPSU Membership Application</h2>
      <table>
        ${row("Name", fullName(data))}
        ${row("Gender", data.gender)}
        ${row("Date of birth", data.dateOfBirth)}
        ${row("Address", address)}
        ${row("Phone (home)", data.phoneHome)}
        ${row("Phone (work)", data.phoneWork)}
        ${row("Phone (cell)", data.phoneCell)}
        ${row("Email", data.email)}
        ${row("Occupation", data.occupation)}
        ${row("Membership signature", data.membershipSignature)}
      </table>
      <h3 style="color:#2563eb;margin-top:24px;">Salary Deduction Authorization</h3>
      <table>
        ${row("Ministry", data.ministry)}
        ${row("Place of work", data.placeOfWork)}
        ${row("Accounting officer / dept.", data.accountingOfficer)}
        ${row("Deduction starts", data.deductionStartMonth)}
        ${row("Witness", data.witnessName)}
      </table>
      <p style="margin-top:24px;color:#525252;font-size:14px;">Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/Dominica" })} (Atlantic/Dominica time).</p>
    </div>
  `;
}

function buildApplicantEmailHtml(data: MembershipFormData): string {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#171717;">
      <h2 style="color:#2563eb;">Thank you for applying, ${escapeHtml(data.firstName)}!</h2>
      <p>We've received your application for membership with the Dominica Public Service Union (DPSU), along with your salary deduction authorization.</p>
      <p>A member of our team will review your application and follow up if anything further is needed.</p>
      <p style="margin-top:24px;color:#525252;font-size:14px;">If you did not submit this application, please contact us at info@dpsu.dm.</p>
      <p style="margin-top:24px;">&mdash; Dominica Public Service Union</p>
    </div>
  `;
}

export async function POST(request: Request) {
  let data: MembershipFormData;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const validationError = validateMembershipForm(data);
  if (validationError) {
    return Response.json({ ok: false, error: validationError }, { status: 400 });
  }

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

  if (internalResult.status === "rejected") {
    console.error("Failed to send internal notification email:", internalResult.reason, data);
  }
  if (applicantResult.status === "rejected") {
    console.error("Failed to send applicant confirmation email:", applicantResult.reason);
  }

  if (internalResult.status === "rejected" && applicantResult.status === "rejected") {
    return Response.json({ ok: false, error: "Failed to send emails. Please try again shortly." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
