import { IEmailProvider } from './email-provider.interface';
import { MailpitProvider } from './mailpit.provider';
import { ConsoleEmailProvider } from './console-email.provider';

export class EmailFactory {
  static create(providerName?: string): IEmailProvider {
    const target = (providerName || process.env.EMAIL_PROVIDER || 'mailpit').toLowerCase();

    switch (target) {
      case 'mailpit':
        return new MailpitProvider();
      case 'console':
      default:
        return new ConsoleEmailProvider();
    }
  }
}
