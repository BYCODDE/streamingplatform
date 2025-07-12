import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokenType, type User } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { generateToken } from 'src/shared/utils/generate-token.util';
import type { Request } from 'express';
import { VerificationInput } from './inputs/verification.input';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { saveSession } from 'src/shared/utils/session.util';

@Injectable()
export class VerificationService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  public async verify(
    req: Request,
    input: VerificationInput,
    userAgent: string,
  ) {
    const { token } = input;
    const existingToken = await this.prisma.token.findFirst({
      where: {
        token,
        type: TokenType.EMAIL_VERIFY,
      },
    });

    if (!existingToken) {
      throw new NotFoundException('Token not found');
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException('Token has expired');
    }

    if (!existingToken.userId) {
      throw new BadRequestException('User not found');
    }

    const user = await this.prisma.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        isEmailVerified: true,
      },
    });
    await this.prisma.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.EMAIL_VERIFY,
      },
    });

    const sessionMetadata = getSessionMetadata(req, userAgent);
    return saveSession(req, user, sessionMetadata);
  }

  public async sendVerificationEmail(user: User) {
    const verificationToken = await generateToken(
      this.prisma,
      user,
      TokenType.EMAIL_VERIFY,
    );

    await this.mail.sendVerificationEmail(user.email, verificationToken.token);
  }
}
