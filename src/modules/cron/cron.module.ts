import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from '../libs/mail/mail.module';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot(), MailModule],
  providers: [CronService, PrismaService],
})
export class CronModule {}
