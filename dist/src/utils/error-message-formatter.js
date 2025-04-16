"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessageFormatter = void 0;
const errorMessageFormatter = (errMessage) => {
    let formattedMessage = errMessage[0].toUpperCase();
    for (let i = 1; i < errMessage.length; i++) {
        const char = errMessage[i];
        if (char === '_') {
            formattedMessage += ` ${errMessage.slice(i + 1)}`;
            break;
        }
        else {
            formattedMessage += char;
        }
    }
    return formattedMessage;
};
exports.errorMessageFormatter = errorMessageFormatter;
//# sourceMappingURL=error-message-formatter.js.map