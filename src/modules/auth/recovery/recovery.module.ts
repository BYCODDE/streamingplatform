import { Module } from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { RecoveryResolver } from './recovery.resolver';
import { MailModule } from 'src/modules/libs/mail/mail.module';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  providers: [RecoveryResolver, RecoveryService],
  imports: [MailModule, PrismaModule],
})
export class RecoveryModule {}
