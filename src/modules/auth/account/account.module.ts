import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { VerificationService } from '../verification/verification.service';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { MailModule } from 'src/modules/libs/mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  providers: [AccountResolver, AccountService, VerificationService, MailService],
})
export class AccountModule {}
