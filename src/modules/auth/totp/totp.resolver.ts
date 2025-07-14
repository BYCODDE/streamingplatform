import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TotpService } from './totp.service';
import { TotpModel } from './models/totp.model';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { User } from 'generated/prisma';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { EnableToptInput } from './inputs/enable-topt.inputs';

@Resolver('Totp')
export class TotpResolver {
  constructor(private readonly totpService: TotpService) {}

  @Authorization()
  @Query(() => TotpModel, { name: 'generateTotpSecret' })
  public async generate(@Authorized() user: User) {
    return this.totpService.generate(user);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'enableTotp' })
  public async enable(
    @Authorized() user: User,
    @Args('data') input: EnableToptInput,
  ) {
    return this.totpService.enable(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'disableTotp' })
  public async disable(@Authorized() user: User) {
    return this.totpService.disable(user);
  }
}
