import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInput } from './input/login.input';
import { verify } from 'argon2';
import { type Request, type Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { RedisService } from 'src/core/redis/redis.service';
import { destroySession, saveSession } from 'src/shared/utils/session.util';
import { VerificationService } from '../verification/verification.service';

@Injectable()
export class SessionService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly verificationService: VerificationService,
  ) {}

  public async findByUser(req: Request) {
    const userId = req.session.userId;

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const keys = await this.redisService.keys('*');

    const userSessions: any[] = [];

    for (const key of keys) {
      const sessionData = await this.redisService.get(key);

      if (sessionData) {
        const session = JSON.parse(sessionData);

        if (session.userId === userId) {
          userSessions.push({
            ...session,
            id: key.split(':')[1],
          });
        }
      }
    }

    userSessions.sort((a, b) => b.createdAt - a.createdAt);

    return userSessions.filter((session) => session.id !== req.session.id);
  }

  public async findCurrent(req: Request) {
    const sessionId = req.session.id;

    const sessionData = await this.redisService.get(
      `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`,
    );

    const session = JSON.parse(sessionData!);

    return {
      ...session,
      id: sessionId,
    };
  }

  public async login(
    req: Request,
    res: Response,
    input: LoginInput,
    userAgent: string,
  ) {
    const { login, password } = input;

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username: { equals: login },
          },
          {
            email: { equals: login },
          },
        ],
      },
    });

    if (!user) {
      throw new NotFoundException(' User not found');
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isEmailVerified) {
      await this.verificationService.sendVerificationEmail(user);
    }

    const sessionMetadata = getSessionMetadata(req, userAgent);

    return saveSession(req, user, sessionMetadata);
  }

  public async logout(req: Request) {
    return destroySession(req, this.configService);
  }

  public async clearSession(req: Request) {
    if (req.res) {
      req.res.clearCookie(
        this.configService.getOrThrow<string>('SESSION_NAME'),
      );
    }

    return true;
  }

  public async remove(req: Request, id: string) {
    if (req.session.id === id) {
      throw new ConflictException('Cannot remove current session');
    }

    await this.redisService.del(
      `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`,
    );

    return true;
  }
}
