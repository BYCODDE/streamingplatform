import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { UserModel } from '../account/models/user.model';
import { LoginInput } from './input/login.input';
import { GqlContext } from 'src/shared/types/gql.context.types';

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => UserModel, { name: 'loginUser' })
  public async login(
    @Context() { req, res }: GqlContext,
    @Args('data') data: LoginInput,
  ) {
    return this.sessionService.login(req, res, data);
  }
}
