import { Injectable, Logger } from '@nestjs/common';
import {
  IEmailService,
  EMAIL_SERVICE,
} from '../../application/user/ports/services.ports';

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    this.logger.log(`Verification email sent to ${to} with token: ${token}`);
    // En prod : un vrai mail est envoyé
  }

  async sendTwoFactorCode(to: string, code: string): Promise<void> {
    this.logger.log(`Two-factor code sent to ${to}: ${code}`);
    // En prod : un vrai mail est envoyé
  }
}
