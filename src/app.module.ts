import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { RedisModule } from './core/redis/redis.module';
import { AccountModule } from './modules/auth/account/account.module';
import { SessionModule } from './modules/auth/session/session.module';
import { MailModule } from './modules/libs/mail/mail.module';
import { VerificationModule } from './modules/auth/verification/verification.module';
import { RecoveryModule } from './modules/auth/recovery/recovery.module';
import { TotpModule } from './modules/auth/totp/totp.module';
import { DeactivateModule } from './modules/auth/deactivate/deactivate.module';
import { CronModule } from './modules/cron/cron.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    AccountModule,
    SessionModule,
    MailModule,
    VerificationModule,
    RecoveryModule,
    TotpModule,
    DeactivateModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
