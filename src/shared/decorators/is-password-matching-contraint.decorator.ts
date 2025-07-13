import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { NewPasswordInput } from 'src/modules/auth/recovery/inputs/new-password.input';

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordMatchingConstraint
  implements ValidatorConstraintInterface
{
  public validate(
    passwordRepeat: string,
    validationArguments: ValidationArguments,
  ) {
    const object = validationArguments.object as NewPasswordInput;
    return object.password === passwordRepeat;
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Passwords do not match';
  }
}
