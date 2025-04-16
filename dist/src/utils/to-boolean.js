"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueToBoolean = exports.ToBoolean = void 0;
const class_transformer_1 = require("class-transformer");
const ToBoolean = () => {
    const toPlain = (0, class_transformer_1.Transform)(({ value }) => {
        return value;
    }, {
        toPlainOnly: true,
    });
    const toClass = (target, key) => {
        return (0, class_transformer_1.Transform)(({ obj }) => {
            return valueToBoolean(obj[key]);
        }, {
            toClassOnly: true,
        })(target, key);
    };
    return function (target, key) {
        toPlain(target, key);
        toClass(target, key);
    };
};
exports.ToBoolean = ToBoolean;
const valueToBoolean = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
        return true;
    }
    if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
        return false;
    }
    return undefined;
};
exports.valueToBoolean = valueToBoolean;
//# sourceMappingURL=to-boolean.js.map