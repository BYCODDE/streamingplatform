import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { SessionService } from './session.service';
import { SessionResolver } from './session.resolver';
import { VerificationService } from '../verification/verification.service';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports: [PrismaModule, ConfigModule, VerificationModule],
  providers: [SessionResolver, SessionService, VerificationService],
})
export class SessionModule {}
