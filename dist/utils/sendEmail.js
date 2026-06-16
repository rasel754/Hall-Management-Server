"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const sendEmail = async (to, subject, html) => {
    if (!env_1.env.EMAIL_HOST || !env_1.env.EMAIL_USER || !env_1.env.EMAIL_PASS) {
        console.log("⚠️ SMTP configuration is missing. Logging email output to console:");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body:\n${html}`);
        return;
    }
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: env_1.env.EMAIL_HOST,
            port: env_1.env.EMAIL_PORT || 2525,
            auth: {
                user: env_1.env.EMAIL_USER,
                pass: env_1.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: env_1.env.EMAIL_FROM || "noreply@hallms.com",
            to,
            subject,
            html,
        });
        console.log(`📧 Email sent successfully to ${to}`);
    }
    catch (error) {
        console.error("❌ Error sending email via SMTP:", error);
        console.log("⚠️ Fallback: Logging email output to console:");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body:\n${html}`);
    }
};
exports.sendEmail = sendEmail;
