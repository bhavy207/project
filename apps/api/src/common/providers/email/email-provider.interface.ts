export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface IEmailProvider {
  readonly name: string;
  sendEmail(options: EmailOptions): Promise<void>;
}
