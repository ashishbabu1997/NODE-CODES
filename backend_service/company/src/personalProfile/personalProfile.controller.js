"use strict";
exports.__esModule = true;
exports.getProfile = void 0;
var personalProfile_manager_1 = require("./personalProfile.manager");
var response_1 = require("../common/response/response");
exports.getProfile = function (req, res) {
    var body = req.query;
    personalProfile_manager_1.getCompanyDetails(body).then(function (response) { return response_1["default"](res, response.code, 1, 200, response.message, response.data); })["catch"](function (error) { return response_1["default"](res, error.code, 0, 400, error.message, error.data); });
};
