import { UnprocessableEntityException, ValidationError } from '@nestjs/common';
export declare const validationExceptionFormatter: (errors: ValidationError[]) => ValidationException;
export declare class ValidationException extends UnprocessableEntityException {
    validationErrors: Record<string, unknown>;
    constructor(validationErrors: Record<string, unknown>);
}
