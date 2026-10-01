import * as nodemailer from 'nodemailer';
import { IEmailProvider, EmailOptions } from './email-provider.interface';

export class MailpitProvider implements IEmailProvider {
  public readonly name = 'mailpit';
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly host: string = process.env.SMTP_HOST || 'localhost',
    private readonly port: number = parseInt(process.env.SMTP_PORT || '1025', 10),
    private readonly from: string = process.env.MAIL_FROM || 'noreply@devpilot.local'
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: false,
      ignoreTLS: true,
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: options.from || this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log(`[Mailpit] Email sent to ${options.to}. View at http://localhost:8025`);
    } catch (error: any) {
      console.warn(`[MailpitProvider] Failed to deliver via Mailpit: ${error.message}. Fallback to console.`);
      console.log(`[Email Fallback] To: ${options.to} | Subject: ${options.subject}`);
    }
  }
}
