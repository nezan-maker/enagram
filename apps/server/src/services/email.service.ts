import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mailerSend: MailerSend | null = null;

export const initEmail = () => {
  if (env.MAILERSEND_API_KEY) {
    mailerSend = new MailerSend({ apiKey: env.MAILERSEND_API_KEY });
  }
};

/**
 * Render an HTML template by replacing {{variable}} placeholders with provided values.
 */
export const renderTemplate = (templateName: string, vars: Record<string, string>): string => {
  const templatePath = path.resolve(__dirname, '..', 'templates', 'email', `${templateName}.html`);
  let html: string;
  try {
    html = fs.readFileSync(templatePath, 'utf-8');
  } catch {
    logger.error(`[Email] Template not found: ${templateName}.html`);
    return '';
  }
  // Replace all {{key}} occurrences
  for (const [key, value] of Object.entries(vars)) {
    html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return html;
};

export const sendEmail = async (to: string, subject: string, htmlOrTemplate: string, vars?: Record<string, string>) => {
  if (!mailerSend) return;

  // If vars are provided, treat htmlOrTemplate as a template name
  const html = vars ? renderTemplate(htmlOrTemplate, vars) : htmlOrTemplate;
  if (!html) return;

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
