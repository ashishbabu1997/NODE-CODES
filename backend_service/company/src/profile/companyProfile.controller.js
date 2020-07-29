"use strict";
exports.__esModule = true;
exports.updateDetails = exports.getDetails = void 0;
var companyProfile_manager_1 = require("./companyProfile.manager");
var response_1 = require("../common/response/response");
exports.getDetails = function (req, res) {
    var body = req.params.companyId;
    companyProfile_manager_1.get_Details(body).then(function (response) { return response_1["default"](res, response.code, 1, response.message, response.data); })["catch"](function (error) { return response_1["default"](res, error.code, 0, error.message, error.data); });
};
exports.updateDetails = function (req, res) {
    var body = req.body;
    companyProfile_manager_1.update_Details(body).then(function (response) {
        response_1["default"](res, response.code, 1, response.message, response.data);
    })["catch"](function (error) {
        response_1["default"](res, error.code, 0, error.message, error.data);
    });
};
