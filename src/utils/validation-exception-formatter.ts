import { UnprocessableEntityException, ValidationError } from '@nestjs/common';
import { errorMessageFormatter } from './error-message-formatter';

// Recursive function to extract and format errors
const extractErrors = (errors: ValidationError[]): any => {
  const formattedErrors = {};

  errors.forEach((error: ValidationError) => {
    if (error.children && error.children.length) {
      formattedErrors[error.property] = extractErrors(error.children);
    } else {
      const eMessage = Object.values(error.constraints)[0];
      formattedErrors[error.property] = errorMessageFormatter(eMessage);
    }
  });

  return formattedErrors;
};

export const validationExceptionFormatter = (errors: ValidationError[]) => {
  const formattedErrors = extractErrors(errors);  
  return new ValidationException(formattedErrors);
};

export class ValidationException extends UnprocessableEntityException {
  constructor(public validationErrors: Record<string, unknown>) {
    super(validationErrors);
  }
}
