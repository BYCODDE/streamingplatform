import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  providers: [AccountResolver, AccountService],
  imports: [PrismaModule],
})
export class AccountModule {}
