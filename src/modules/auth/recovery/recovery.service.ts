import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import type { Request } from 'express';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { generateToken } from 'src/shared/utils/generate-token.util';
import { TokenType } from 'generated/prisma';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { NewPasswordInput } from './inputs/new-password.input';
import { hash } from 'argon2';

@Injectable()
export class RecoveryService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  public async resetPassword(
    req: Request,
    input: ResetPasswordInput,
    userAgent: string,
  ) {
    const { email } = input;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = await generateToken(
      this.prisma,
      user,
      TokenType.PASSWORD_RESET,
    );

    const metadata = getSessionMetadata(req, userAgent);

    await this.mailService.sendPasswordResetEmail(
      user.email,
      resetToken.token,
      metadata,
    );

    return true;
  }

  public async newPassword(input: NewPasswordInput) {
    const { password, token } = input;

    const exisitingToken = await this.prisma.token.findUnique({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (!exisitingToken) {
      throw new NotFoundException('Token not found');
    }

    const hasExpired = new Date(exisitingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException('Token has expired');
    }
    if (!exisitingToken.userId) {
      throw new BadRequestException('Invalid token');
    }

    await this.prisma.user.update({
      where: { id: exisitingToken.userId },
      data: {
        password: await hash(password),
      },
    });

    await this.prisma.token.delete({
      where: { id: exisitingToken.id, type: TokenType.PASSWORD_RESET },
    });

    return true;
  }
}
