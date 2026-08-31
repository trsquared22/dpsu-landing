import { prisma } from "@/lib/db";
import { isMailerConfigured, sendEmail } from "@/lib/mailer";
import { fullName, validateMembershipForm, type MembershipFormData } from "@/lib/membership";
import { toMembershipApplicationData } from "@/lib/membership-db";

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

function signatureRow(signature: string): string {
  if (!signature) return "";
  const cell = signature.startsWith("data:image")
    ? `<img src="${signature}" alt="Signature" style="max-height:80px;border:1px solid #e5e5e5;border-radius:4px;padding:4px;background:#fff;" />`
    : `<span style="font-weight:600;">${escapeHtml(signature)}</span>`;
  return `<tr><td style="padding:4px 12px 4px 0;color:#525252;white-space:nowrap;vertical-align:top;">Membership signature</td><td style="padding:4px 0;">${cell}</td></tr>`;
}

function buildInternalEmailHtml(data: MembershipFormData): string {
  const address = [data.addressLine1, data.addressLine2, data.addressLine3].filter(Boolean).join(", ");
  const isSalaryDeduction = data.paymentMethod === "salary_deduction";
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#171717;">
      <h2 style="color:#2563eb;">New DPSU Membership Application</h2>
      <table>
        ${row("Name", fullName(data))}
        ${row("Gender", data.gender === "female" ? "Female" : data.gender === "male" ? "Male" : "")}
        ${row("Date of birth", data.dateOfBirth)}
        ${row("Address", address)}
        ${row("Phone (home)", data.phoneHome)}
        ${row("Phone (work)", data.phoneWork)}
        ${row("Phone (cell)", data.phoneCell)}
        ${row("Email", data.email)}
        ${row("Occupation", data.occupation)}
        ${signatureRow(data.membershipSignature)}
      </table>
      <h3 style="color:#2563eb;margin-top:24px;">Subscription Payment</h3>
      <table>
        ${row("Payment method", isSalaryDeduction ? "Salary deduction" : "Over the counter")}
        ${
          isSalaryDeduction
            ? `
              ${row("Company / Establishment", data.establishment)}
              ${row("Ministry / Department", data.ministryDepartment)}
              ${row("Place of work", data.placeOfWork)}
              ${row("Accounting officer / dept.", data.accountingOfficer)}
              ${row("Deduction starts", data.deductionStartMonth)}
            `
            : row("1st payment date", data.firstPaymentDate)
        }
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
      <p style="margin-top:24px;color:#525252;font-size:14px;">If you did not submit this application, please contact us at dominicapsu@gmail.com.</p>
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

  // Persisting is the durability guarantee - this must succeed for the
  // response to report success. Email below is best-effort: the application
  // is already safely stored (visible in /admin/applications) regardless of
  // whether either email actually sends.
  try {
    await prisma.membershipApplication.create({ data: toMembershipApplicationData(data) });
  } catch (err) {
    console.error("Failed to save membership application:", err, data);
    return Response.json(
      { ok: false, error: "Failed to save your application. Please try again shortly." },
      { status: 500 }
    );
  }

  const notificationEmails = (process.env.DPSU_NOTIFICATION_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (!isMailerConfigured() || notificationEmails.length === 0) {
    console.error("Membership application saved but email is not configured:", data);
    return Response.json({ ok: true });
  }

  const [internalResult, applicantResult] = await Promise.allSettled([
    sendEmail({
      to: notificationEmails,
      subject: `New DPSU Membership Application: ${fullName(data)}`,
      html: buildInternalEmailHtml(data),
    }),
    sendEmail({
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

  return Response.json({ ok: true });
}
