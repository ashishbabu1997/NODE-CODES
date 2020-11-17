"use strict";
exports.__esModule = true;
var response_1 = require("../common/response/response");
exports["default"] = (function (schema) {
    return function (req, res, next) {
        var body = (req.route.methods.hasOwnProperty("post") || req.route.methods.hasOwnProperty("put"))
            ? (body = req.body)
            : (body = req.query);
        var _a = schema.validate(body), error = _a.error, value = _a.value;
        if (error) {
            console.log(error);
            response_1["default"](res, 400, 0, 405, error.message, {});
        }
        else {
            next();
        }
    };
});
