"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = exports.ApiError = void 0;
var errors_1 = require("./errors");
Object.defineProperty(exports, "ApiError", { enumerable: true, get: function () { return errors_1.ApiError; } });
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
//# sourceMappingURL=index.js.map