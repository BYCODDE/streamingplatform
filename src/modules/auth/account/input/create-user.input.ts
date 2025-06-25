import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'Username must contain only English letters and numbers',
  })
  public username: string;
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password: string;
}
