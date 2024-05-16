import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isSet', async: false })
class IsSetConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return value instanceof Set;
  }

  defaultMessage() {
    return 'The property $property must be a Set.';
  }
}

export function IsSet(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSetConstraint,
    });
  };
}
