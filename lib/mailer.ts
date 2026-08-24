import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const user = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!user || !appPassword) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: appPassword },
    });
  }
  return transporter;
}

export function isMailerConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

export async function sendEmail(options: { to: string | string[]; subject: string; html: string }) {
  const transport = getTransporter();
  if (!transport) {
    throw new Error("Gmail SMTP is not configured (GMAIL_USER/GMAIL_APP_PASSWORD missing).");
  }

  const fromName = process.env.GMAIL_FROM_NAME;
  const from = fromName ? `${fromName} <${process.env.GMAIL_USER}>` : process.env.GMAIL_USER!;

  return transport.sendMail({ from, ...options });
}
