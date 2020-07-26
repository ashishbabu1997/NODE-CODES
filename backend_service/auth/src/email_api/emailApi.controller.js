"use strict";
exports.__esModule = true;
exports.emailSignup = void 0;
var emailApi_manager_1 = require("./emailApi.manager");
var response_1 = require("../common/response/response");
exports.emailSignup = function (req, res) {
    var body = req.body.email;
    emailApi_manager_1.sendOtp(body).then(function (response) { return response_1["default"](res, response.code, 1, response.message, response.data); })["catch"](function (error) { return response_1["default"](res, error.code, 0, error.message, error.data); });
};
