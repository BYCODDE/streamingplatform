import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength, Validate } from 'class-validator';
import { IsPasswordMatchingConstraint } from 'src/shared/decorators/is-password-matching-contraint.decorator';

@InputType()
export class NewPasswordInput {
  @Field(() => String)
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  public password: string;

  @Field(() => String)
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Validate(IsPasswordMatchingConstraint)
  public passwordRepeat: string;

  @Field(() => String)
  @IsUUID('4')
  @IsNotEmpty()
  public token: string;
}
