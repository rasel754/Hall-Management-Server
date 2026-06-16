import nodemailer from "nodemailer";
import { env } from "../config/env";

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  if (!env.EMAIL_HOST || !env.EMAIL_USER || !env.EMAIL_PASS) {
    console.log("⚠️ SMTP configuration is missing. Logging email output to console:");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${html}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT || 2525,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: env.EMAIL_FROM || "noreply@hallms.com",
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent successfully to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email via SMTP:", error);
    console.log("⚠️ Fallback: Logging email output to console:");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${html}`);
  }
};
