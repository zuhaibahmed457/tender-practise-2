"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = exports.validationExceptionFormatter = void 0;
const common_1 = require("@nestjs/common");
const error_message_formatter_1 = require("./error-message-formatter");
const extractErrors = (errors) => {
    const formattedErrors = {};
    errors.forEach((error) => {
        if (error.children && error.children.length) {
            formattedErrors[error.property] = extractErrors(error.children);
        }
        else {
            const eMessage = Object.values(error.constraints)[0];
            formattedErrors[error.property] = (0, error_message_formatter_1.errorMessageFormatter)(eMessage);
        }
    });
    return formattedErrors;
};
const validationExceptionFormatter = (errors) => {
    const formattedErrors = extractErrors(errors);
    return new ValidationException(formattedErrors);
};
exports.validationExceptionFormatter = validationExceptionFormatter;
class ValidationException extends common_1.UnprocessableEntityException {
    constructor(validationErrors) {
        super(validationErrors);
        this.validationErrors = validationErrors;
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=validation-exception-formatter.js.map