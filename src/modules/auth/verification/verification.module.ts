import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { MailModule } from 'src/modules/libs/mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  providers: [VerificationResolver, VerificationService],
})
export class VerificationModule {}
