"use strict";
exports.__esModule = true;
exports["default"] = (function (response, code, status, responseCode, message, data) {
    response.status(code).json({
        status: status, responseCode: responseCode, message: message, data: data
    });
});
