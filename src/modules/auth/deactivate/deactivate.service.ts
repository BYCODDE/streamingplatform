import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import type { User } from 'generated/prisma';
import type { Request } from 'express';
import { generateToken } from 'src/shared/utils/generate-token.util';
import { TokenType } from 'generated/prisma';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { destroySession } from 'src/shared/utils/session.util';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import { verify } from 'argon2';

@Injectable()
export class DeactivateService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  public async deactivate(
    req: Request,
    input: DeactivateAccountInput,
    user: User,
    userAgent: string,
  ) {
    const { email, password, pin } = input;

    if (email !== user.email) {
      throw new BadRequestException('Invalid email');
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new BadRequestException('Invalid password');
    }

    if (!pin) {
      await this.sendDeactivateToken(req, user, userAgent);

      return {
        message: 'Need token to Deactivation,check your email',
      };
    }

    await this.validateDeactivateToken(req, pin);

    return {
      user,
    };
  }

  private async validateDeactivateToken(req: Request, token: string) {
    const existingToken = await this.prisma.token.findFirst({
      where: {
        token,
        type: TokenType.DEACTIVATE_ACCOUNT,
      },
    });

    if (!existingToken) {
      throw new NotFoundException('Token not found');
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException('Token expired');
    }

    if (!existingToken.userId) {
      throw new BadRequestException('User not found');
    }

    await this.prisma.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        isDeactivated: true,
        deactivatedAt: new Date(),
      },
    });

    await this.prisma.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.DEACTIVATE_ACCOUNT,
      },
    });

    return destroySession(req, this.config);
  }

  public async sendDeactivateToken(
    req: Request,
    user: User,
    userAgent: string,
  ) {
    const deactivateToken = await generateToken(
      this.prisma,
      user,
      TokenType.DEACTIVATE_ACCOUNT,
      false,
    );

    const metadata = getSessionMetadata(req, userAgent);

    await this.mail.sendDeactivateToken(
      user.email,
      deactivateToken.token,
      metadata,
    );

    return true;
  }
}
