import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { RecoveryService } from './recovery.service';
import { GqlContext } from 'src/shared/types/gql.context.types';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';
import { NewPasswordInput } from './inputs/new-password.input';

@Resolver('Recovery')
export class RecoveryResolver {
  constructor(private readonly recoveryService: RecoveryService) {}

  @Mutation(() => Boolean, { name: 'resetPassword' })
  public async resetPassword(
    @Context() { req }: GqlContext,
    @Args('data') input: ResetPasswordInput,
    @UserAgent() userAgent: string,
  ) {
    return this.recoveryService.resetPassword(req, input, userAgent);
  }

  @Mutation(() => Boolean, { name: 'newPassword' })
  public async newPassword(
    @Args('data') input: NewPasswordInput,
  ) {
    return this.recoveryService.newPassword(input);
  }
}
