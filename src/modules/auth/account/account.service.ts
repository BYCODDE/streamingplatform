import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { CreateUserInput } from './input/create-user.input';
import { VerificationService } from '../verification/verification.service';

@Injectable()
export class AccountService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly verificationService: VerificationService,
  ) {}

  public async me(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  public async create(input: CreateUserInput) {
    const { username, email, password } = input;

    const isUsernameExists = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (isUsernameExists) {
      throw new ConflictException('Username already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: await hash(password),
        displayName: username,
      },
    });

    await this.verificationService.sendVerificationEmail(user);

    return true;
  }
}
