import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInput } from './input/login.input';
import { verify } from 'argon2';
import { type Request, type Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async login(req: Request, res: Response, input: LoginInput) {
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

    return await new Promise((resolve, reject) => {
      req.session.createdAt = new Date().toISOString();
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'cannot save session,please try again later',
            ),
          );
        }
        resolve(user);
      });
    });
  }

  public async logout(req: Request, res: Response) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'cannot destroy session, please try again later',
            ),
          );
        }

        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve(true);
      });
    });
  }
}
