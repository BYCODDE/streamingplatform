import { Module } from '@nestjs/common';
import { DeactivateService } from './deactivate.service';
import { DeactivateResolver } from './deactivate.resolver';
import { MailModule } from 'src/modules/libs/mail/mail.module';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [DeactivateResolver, DeactivateService],
  imports: [MailModule, PrismaModule, ConfigModule],
})
export class DeactivateModule {}
