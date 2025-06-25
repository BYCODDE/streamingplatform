import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => String)
  public id: string;

  @Field(() => String)
  public email: string;

  @Field(() => String)
  public createdAt: string;

  @Field(() => String)
  public password: string;

  @Field(() => String)
  public displayName: string;

  @Field(() => String, { nullable: true })
  public avatar: string;

  @Field(() => String, { nullable: true })
  public bio: string;

  @Field(() => String, { nullable: true })
  public updatedAt: string;
}
