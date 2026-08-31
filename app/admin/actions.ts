"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { encryptSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { isMailerConfigured, sendEmail } from "@/lib/mailer";

export async function login(_prevState: string | null, formData: FormData): Promise<string | null> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return "Email and password are required.";
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return "Invalid email or password.";
  }

  const { token, expiresAt } = await encryptSession(admin.id);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}

const APPLICATION_STATUSES = ["pending", "active", "inactive"] as const;
export type ApplicationStatusValue = (typeof APPLICATION_STATUSES)[number];

function isApplicationStatus(value: string): value is ApplicationStatusValue {
  return (APPLICATION_STATUSES as readonly string[]).includes(value);
}

export interface ApplicationFormValues {
  gender: string;
  firstName: string;
  middleName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  phoneHome: string;
  phoneWork: string;
  phoneCell: string;
  dateOfBirth: string;
  email: string;
  occupation: string;
  membershipSignature: string;
  paymentMethod: string;
  establishment: string;
  ministryDepartment: string;
  placeOfWork: string;
  accountingOfficer: string;
  deductionStartMonth: string;
  firstPaymentDate: string;
  witnessName: string;
  agreeTerms: boolean;
  agreeDeduction: boolean;
  status: ApplicationStatusValue;
}

function orNull(value: string): string | null {
  return value.trim() ? value.trim() : null;
}

function readApplicationForm(formData: FormData) {
  const get = (name: string) => String(formData.get(name) ?? "").trim();
  const statusInput = get("status");
  return {
    gender: orNull(get("gender")),
    firstName: get("firstName"),
    middleName: orNull(get("middleName")),
    lastName: get("lastName"),
    addressLine1: get("addressLine1"),
    addressLine2: orNull(get("addressLine2")),
    addressLine3: orNull(get("addressLine3")),
    phoneHome: orNull(get("phoneHome")),
    phoneWork: orNull(get("phoneWork")),
    phoneCell: get("phoneCell"),
    dateOfBirth: get("dateOfBirth"),
    email: get("email"),
    occupation: get("occupation"),
    membershipSignature: get("membershipSignature"),
    paymentMethod: get("paymentMethod"),
    establishment: orNull(get("establishment")),
    ministryDepartment: orNull(get("ministryDepartment")),
    placeOfWork: orNull(get("placeOfWork")),
    accountingOfficer: orNull(get("accountingOfficer")),
    deductionStartMonth: orNull(get("deductionStartMonth")),
    firstPaymentDate: orNull(get("firstPaymentDate")),
    witnessName: orNull(get("witnessName")),
    agreeTerms: formData.get("agreeTerms") === "on",
    agreeDeduction: formData.get("agreeDeduction") === "on",
    status: isApplicationStatus(statusInput) ? statusInput : "pending",
  };
}

function buildAcceptanceEmailHtml(firstName: string): string {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#171717;">
      <h2 style="color:#2563eb;">Welcome to the Dominica Public Service Union, ${firstName}!</h2>
      <p>We're pleased to confirm that your membership application has been reviewed and accepted.</p>
      <p>You are now an active member of the Dominica Public Service Union (DPSU). Thank you for joining us in
      standing together for workers' rights and benefits.</p>
      <p style="margin-top:24px;color:#525252;font-size:14px;">If you have any questions, please contact us at
      dominicapsu@gmail.com.</p>
      <p style="margin-top:24px;">&mdash; Dominica Public Service Union</p>
    </div>
  `;
}

async function sendActivationEmailIfNeeded(
  previousStatus: ApplicationStatusValue,
  next: { status: ApplicationStatusValue; email: string; firstName: string }
) {
  if (next.status !== "active" || previousStatus === "active") return;
  if (!isMailerConfigured()) {
    console.error("Application marked active but email is not configured; confirmation not sent to:", next.email);
    return;
  }
  try {
    await sendEmail({
      to: next.email,
      subject: "Your DPSU Membership Has Been Confirmed",
      html: buildAcceptanceEmailHtml(next.firstName),
    });
  } catch (err) {
    console.error("Failed to send membership acceptance email:", err);
  }
}

export async function createApplication(_prevState: string | null, formData: FormData): Promise<string | null> {
  await verifySession();
  const data = readApplicationForm(formData);

  if (!data.firstName || !data.lastName || !data.email || !data.membershipSignature) {
    return "First name, last name, email, and signature are required.";
  }

  const created = await prisma.membershipApplication.create({ data });
  // "pending" is always the starting status for a brand new record, so this
  // can only fire if someone creates a new application already marked active.
  await sendActivationEmailIfNeeded("pending", created);
  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  redirect(`/admin/applications/${created.id}`);
}

export async function updateApplication(
  id: string,
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  await verifySession();
  const data = readApplicationForm(formData);

  if (!data.firstName || !data.lastName || !data.email || !data.membershipSignature) {
    return "First name, last name, email, and signature are required.";
  }

  const existing = await prisma.membershipApplication.findUniqueOrThrow({
    where: { id },
    select: { status: true },
  });

  const updated = await prisma.membershipApplication.update({ where: { id }, data });
  await sendActivationEmailIfNeeded(existing.status, updated);

  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
  return "Saved.";
}

export async function updateApplicationStatus(id: string, status: string) {
  await verifySession();
  if (!isApplicationStatus(status)) return;

  const existing = await prisma.membershipApplication.findUniqueOrThrow({
    where: { id },
    select: { status: true },
  });

  const updated = await prisma.membershipApplication.update({ where: { id }, data: { status } });
  await sendActivationEmailIfNeeded(existing.status, updated);

  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
}

export async function deleteApplication(id: string) {
  await verifySession();
  await prisma.membershipApplication.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  redirect("/admin/applications");
}

export async function createAdmin(_prevState: string | null, formData: FormData): Promise<string | null> {
  await verifySession();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return "Email and password are required.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return "An admin with that email already exists.";
  }

  const passwordHash = await hashPassword(password);
  await prisma.adminUser.create({ data: { email, passwordHash } });

  revalidatePath("/admin/team");
  return `Admin account created for ${email}.`;
}

export async function deleteAdmin(id: string) {
  const session = await verifySession();
  if (id === session.adminId) {
    return; // never allow removing the account you're currently signed in as
  }

  const adminCount = await prisma.adminUser.count();
  if (adminCount <= 1) {
    return; // never allow removing the last remaining admin account
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/team");
}
