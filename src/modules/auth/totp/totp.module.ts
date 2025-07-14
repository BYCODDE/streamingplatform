import { Module } from '@nestjs/common';
import { TotpService } from './totp.service';
import { TotpResolver } from './totp.resolver';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TotpResolver, TotpService],
})
export class TotpModule {}
