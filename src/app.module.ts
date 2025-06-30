import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { RedisModule } from './core/redis/redis.module';
import { AccountModule } from './modules/auth/account/account.module';
import { SessionModule } from './modules/auth/session/session.module';

@Module({
  imports: [PrismaModule, RedisModule, AccountModule, SessionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
