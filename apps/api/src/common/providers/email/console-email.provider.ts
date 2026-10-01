import { IEmailProvider, EmailOptions } from './email-provider.interface';

export class ConsoleEmailProvider implements IEmailProvider {
  public readonly name = 'console';

  async sendEmail(options: EmailOptions): Promise<void> {
    console.log('\n--- [DEV EMAIL DISPATCHED] ---');
    console.log(`From:    ${options.from || 'noreply@devpilot.local'}`);
    console.log(`To:      ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body:    ${options.html.substring(0, 150)}...`);
    console.log('------------------------------\n');
  }
}
