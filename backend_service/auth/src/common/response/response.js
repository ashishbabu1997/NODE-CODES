"use strict";
exports.__esModule = true;
exports["default"] = (function (response, code, status, message, data) {
    response.status(code).json({
        status: status, message: message, data: data
    });
});
