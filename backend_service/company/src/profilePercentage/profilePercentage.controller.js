"use strict";
exports.__esModule = true;
exports.getProfilePercentage = void 0;
var profilePercentage_manager_1 = require("./profilePercentage.manager");
var response_1 = require("../common/response/response");
exports.getProfilePercentage = function (req, res) {
    var body = req.query;
    profilePercentage_manager_1.getPercentage(body).then(function (response) { return response_1["default"](res, response.code, 1, 200, response.message, response.data); })["catch"](function (error) { return response_1["default"](res, error.code, 0, 400, error.message, error.data); });
};
