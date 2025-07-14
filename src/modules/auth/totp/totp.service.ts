import type { User } from 'generated/prisma';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { encode } from 'hi-base32';
import { randomBytes } from 'crypto';
import { TOTP } from 'otpauth';
import * as QRCode from 'qrcode';
import { EnableToptInput } from './inputs/enable-topt.inputs';

@Injectable()
export class TotpService {
  public constructor(private readonly prisma: PrismaService) {}

  public async generate(user: User) {
    const secret = encode(randomBytes(15)).replace(/=/g, '').substring(0, 24);

    const totp = new TOTP({
      issuer: 'Streaming Platform',
      label: `${user.email}`,
      algorithm: 'SHA1',
      digits: 6,
      secret,
    });

    const otpauthUrl = totp.toString();
    const qrcodeUrl = await QRCode.toDataURL(otpauthUrl);

    return {
      qrcodeUrl,
      secret,
    };
  }

  public async enable(user: User, input: EnableToptInput) {
    const { secret, pin } = input;

    const totp = new TOTP({
      issuer: 'Streaming Platform',
      label: `${user.email}`,
      algorithm: 'SHA1',
      digits: 6,
      secret,
    });

    const delta = totp.validate({ token: pin });

    if (delta === null) {
      throw new BadRequestException('Invalid Code');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isToptEnabled: true,
        toptSecret: secret,
      },
    });

    return true;
  }

  public async disable(user: User) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isToptEnabled: false,
        toptSecret: null,
      },
    });
    return true;
  }
}
