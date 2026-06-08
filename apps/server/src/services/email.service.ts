// MailerSend wrapper for transactional emails
// Uses MailerSend API (v3 SDK) — set MAILERSEND_API_KEY in env

import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { env } from '../config/env.js';

let mailerSend: MailerSend | null = null;

export const initEmail = () => {
  if (env.MAILERSEND_API_KEY) {
    mailerSend = new MailerSend({ apiKey: env.MAILERSEND_API_KEY });
  }
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!mailerSend) return;

  // Parse "Name <email>" format from EMAIL_FROM
  const fromMatch = env.EMAIL_FROM.match(/^(.*?)\s*<(.+?)>$/);
  const fromEmail = fromMatch ? fromMatch[2] : env.EMAIL_FROM;
  const fromName = fromMatch ? fromMatch[1].trim() : '';

  const sentFrom = new Sender(fromEmail, fromName);
  const recipients = [new Recipient(to)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(html);

  await mailerSend.email.send(emailParams);
};
