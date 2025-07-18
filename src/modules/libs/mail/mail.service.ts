import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { VerificationTemplate } from '../templates/verification.template';
import { SessionMetadata } from 'src/shared/types/session-metadata.types';
import { PasswordRecoveryTemplate } from '../templates/password-recovery.template';
import { DeactivateTemplate } from '../templates/deactivate.template';
import { AccountDeletionTemplate } from '../templates/account-deletion.template';

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendPasswordResetEmail(
    email: string,
    token: string,
    metadata: SessionMetadata,
  ) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(
      PasswordRecoveryTemplate({ domain, token, metadata }),
    );
    return this.sendEmail(email, 'Reset your password', html);
  }

  public async sendVerificationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(VerificationTemplate({ domain, token }));

    return this.sendEmail(email, 'Verify your email', html);
  }

  public async sendDeactivateToken(
    email: string,
    token: string,
    metadata: SessionMetadata,
  ) {
    const html = await render(DeactivateTemplate({ token, metadata }));

    return this.sendEmail(email, 'Deactivate your account', html);
  }

  public async sendAccountDeletionEmail(email: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(AccountDeletionTemplate({ domain }));

    return this.sendEmail(email, 'Account Deletion', html);
  }

  private sendEmail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
