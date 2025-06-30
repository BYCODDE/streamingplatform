import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { SessionService } from './session.service';
import { SessionResolver } from './session.resolver';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [SessionResolver, SessionService],
})
export class SessionModule {}
