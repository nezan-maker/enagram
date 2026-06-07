// Nodemailer wrapper (Section 7)
// Stub — requires SMTP credentials in env

import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter: nodemailer.Transporter | null = null;

export const initEmail = () => {
  if (env.SMTP_HOST && env.SMTP_PORT) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!transporter) return;
  await transporter.sendMail({
    from: env.EMAIL_FROM || 'Enagram <noreply@enagram.com>',
    to,
    subject,
    html,
  });
};
