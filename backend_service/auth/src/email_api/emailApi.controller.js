"use strict";
exports.__esModule = true;
exports.getEmail = void 0;
var emailApi_manager_1 = require("./emailApi.manager");
var response_1 = require("../common/response/response");
exports.getEmail = function (req, res) {
    var body = req.params;
    emailApi_manager_1.addDetails(body).then(function (response) { return response_1["default"](res, response.code, 1, response.message, response.data); })["catch"](function (error) { return response_1["default"](res, error.code, 0, error.message, error.data); });
    // emailApi_manager_1.mailer(body).then(function (response) { return response_1["default"](res, response.code, 1, response.message, response.data); })["catch"](function (error) { return response_1["default"](res, error.code, 0, error.message, error.data); });
};
