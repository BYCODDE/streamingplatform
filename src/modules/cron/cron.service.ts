import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from '../libs/mail/mail.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  // @Cron('*/10 * * * * *')
  @Cron('0 0 * * *')
  public async deleteDeactivateAccounts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    // sevenDaysAgo.setSeconds(sevenDaysAgo.getSeconds() - 5);

    const deactivateAccounts = await this.prisma.user.findMany({
      where: {
        isDeactivated: true,
        deactivatedAt: {
          lte: sevenDaysAgo,
        },
      },
    });

    console.log(deactivateAccounts);

    for (const user of deactivateAccounts) {
      await this.mail.sendAccountDeletionEmail(user.email);
    }

    await this.prisma.user.deleteMany({
      where: {
        isDeactivated: true,
        deactivatedAt: {
          lte: sevenDaysAgo,
        },
      },
    });
  }
}
