import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateIf } from "class-validator";
import { Length } from "class-validator";


@InputType()
export class DeactivateAccountInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password: string;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.pin != undefined)
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  public pin?: string;
}