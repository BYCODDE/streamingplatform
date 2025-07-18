import { ConfigService } from '@nestjs/config';
import type { MailerOptions } from '@nestjs-modules/mailer';

export function getMailerConfig(configService: ConfigService): MailerOptions {
  return {
    transport: {
      host: configService.getOrThrow<string>('MAIL_HOST'),
      port: configService.getOrThrow<number>('MAIL_PORT'),
      secure: true,
      auth: {
        user: configService.getOrThrow<string>('MAIL_LOGIN'),
        pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
      },
    },
    defaults: {
      from: `"LineStream" <${configService.getOrThrow<string>('MAIL_LOGIN')}>`,
    },
  };
}
